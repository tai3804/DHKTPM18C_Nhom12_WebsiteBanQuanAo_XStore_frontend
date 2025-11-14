// API endpoint for Vietnamese administrative units
const PROVINCES_API = 'https://provinces.open-api.vn/api';

// Get all provinces
export const getProvinces = async () => {
  try {
    const response = await fetch(`${PROVINCES_API}/p/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Provinces loaded:', data.length);
    
    // Map provinces with proper data structure
    const provinces = data.map(province => ({
      code: province.code.toString(),
      name: province.name,
      type: province.division_type
    }));
    
    // Separate provinces by priority and type (based on name since API has encoding issues)
    const priorityProvinces = [];
    const cityProvinces = [];
    const otherProvinces = [];
    
    provinces.forEach(province => {
      const isTPHCM = province.code === '79' || province.name.toLowerCase().includes('hồ chí minh') || province.name.toLowerCase().includes('ho chi minh');
      const isHaNoi = province.code === '1' || province.name.toLowerCase().includes('hà nội') || province.name.toLowerCase().includes('ha noi');
      const isCentralCity = province.name.toLowerCase().includes('thành phố') || 
                           ['hà nội', 'hồ chí minh', 'đà nẵng', 'cần thơ', 'hải phòng', 'huế'].some(city => 
                             province.name.toLowerCase().includes(city.toLowerCase())
                           );
      
      // TP.HCM và Hà Nội ưu tiên cao nhất
      if (isTPHCM || isHaNoi) {
        priorityProvinces.push(province);
      }
      // Các thành phố trung ương khác
      else if (isCentralCity) {
        cityProvinces.push(province);
      }
      // Các tỉnh thông thường
      else {
        otherProvinces.push(province);
      }
    });
    
    // Sắp xếp TP.HCM trước, Hà Nội sau
    priorityProvinces.sort((a, b) => {
      const aIsHCM = a.code === '79' || a.name.toLowerCase().includes('hồ chí minh');
      const bIsHCM = b.code === '79' || b.name.toLowerCase().includes('hồ chí minh');
      if (aIsHCM && !bIsHCM) return -1; // TP.HCM lên đầu
      if (!aIsHCM && bIsHCM) return 1;
      return 0;
    });
    
    // Sắp xếp các thành phố trung ương theo bảng chữ cái
    cityProvinces.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    
    // Sắp xếp các tỉnh theo bảng chữ cái
    otherProvinces.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    
    // Kết hợp theo thứ tự ưu tiên
    const sortedProvinces = [
      ...priorityProvinces,
      ...cityProvinces,
      ...otherProvinces
    ];
    
    console.log('Provinces sorted:', {
      priority: priorityProvinces.length,
      cities: cityProvinces.length, 
      others: otherProvinces.length,
      total: sortedProvinces.length
    });
    return sortedProvinces;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

// Get districts by province code
export const getDistrictsByProvinceCode = async (provinceCode) => {
  try {
    console.log('Loading districts for province:', provinceCode);
    const response = await fetch(`${PROVINCES_API}/p/${provinceCode}?depth=2`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.districts) {
      console.log(`Found ${data.districts.length} districts for province ${provinceCode}`);
      
      const districts = data.districts.map(district => ({
        code: district.code.toString(),
        name: district.name,
        province_code: provinceCode.toString(),
        type: district.division_type
      }));
      
      // Sắp xếp districts theo bảng chữ cái
      districts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      
      console.log('Districts sorted alphabetically');
      return districts;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

// Get wards by district code
export const getWardsByDistrictCode = async (districtCode) => {
  try {
    console.log('Loading wards for district:', districtCode);
    const response = await fetch(`${PROVINCES_API}/d/${districtCode}?depth=2`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.wards) {
      console.log(`Found ${data.wards.length} wards for district ${districtCode}`);
      
      const wards = data.wards.map(ward => ({
        code: ward.code.toString(),
        name: ward.name,
        district_code: districtCode.toString(),
        type: ward.division_type
      }));
      
      // Sắp xếp wards theo bảng chữ cái
      wards.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      
      console.log('Wards sorted alphabetically');
      return wards;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching wards by district:', error);
    return [];
  }
};

// Get all wards by province code (for simplified province-ward selection)
export const getWardsByProvinceCode = async (provinceCode) => {
  try {
    console.log('Loading all wards for province:', provinceCode);
    
    const response = await fetch(`${PROVINCES_API}/p/${provinceCode}?depth=3`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.districts) {
      console.error('No districts data in response');
      return [];
    }
    
    // Extract all wards from all districts
    const allWards = [];
    
    // First, sort districts alphabetically
    const sortedDistricts = data.districts.sort((a, b) => 
      a.name.localeCompare(b.name, 'vi')
    );
    
    sortedDistricts.forEach(district => {
      if (district.wards && Array.isArray(district.wards)) {
        // Sort wards within each district alphabetically
        const sortedWards = district.wards.sort((a, b) => 
          a.name.localeCompare(b.name, 'vi')
        );
        
        sortedWards.forEach(ward => {
          allWards.push({
            code: ward.code.toString(),
            name: ward.name,
            district_code: district.code.toString(),
            district_name: district.name,
            province_code: provinceCode.toString(),
            type: ward.division_type
          });
        });
      }
    });
    
    console.log(`Found ${allWards.length} wards total for province ${provinceCode} (sorted)`);
    return allWards;
    
  } catch (error) {
    console.error('Error fetching wards by province:', error);
    return [];
  }
};

// Get province by code
export const getProvinceByCode = async (provinceCode) => {
  try {
    const response = await fetch(`${PROVINCES_API}/p/${provinceCode}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      code: data.code.toString(),
      name: data.name,
      type: data.division_type
    };
  } catch (error) {
    console.error('Error fetching province by code:', error);
    return null;
  }
};

// Get district by code
export const getDistrictByCode = async (districtCode) => {
  try {
    const response = await fetch(`${PROVINCES_API}/d/${districtCode}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      code: data.code.toString(),
      name: data.name,
      province_code: data.province_code.toString(),
      type: data.division_type
    };
  } catch (error) {
    console.error('Error fetching district by code:', error);
    return null;
  }
};

// Get ward by code
export const getWardByCode = async (wardCode) => {
  try {
    const response = await fetch(`${PROVINCES_API}/w/${wardCode}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      code: data.code.toString(),
      name: data.name,
      district_code: data.district_code.toString(),
      type: data.division_type
    };
  } catch (error) {
    console.error('Error fetching ward by code:', error);
    return null;
  }
};