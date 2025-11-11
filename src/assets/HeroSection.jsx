import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl tracking-tight font-bold">
              Transform Your
              <span className="block text-primary">Closet Space</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Discover our premium collection of closet organizers, storage systems, and accessories to maximize your
              space and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8">Shop Now</Button>
              <Button variant="outline" className="h-10 px-8 bg-transparent">
                Browse Collections
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9★</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="/modern-organized-closet.jpg"
                alt="Modern organized closet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background border border-border rounded-xl p-4 shadow-lg">
              <p className="text-sm font-medium">Free Design Consultation</p>
              <p className="text-xs text-muted-foreground">Available Now</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
