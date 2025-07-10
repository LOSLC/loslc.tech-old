import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      role: "Cybersecurity Enthusiast",
      content: "The cybersecurity workshops helped me understand Linux security fundamentals. I now feel confident implementing security best practices in my work.",
      avatar: "🔒"
    },
    {
      role: "Community Member",
      content: "It's been already 1 month since I've joined this community and I'd like to contribute to building it",
      avatar: "🧑‍💻"
    },
    {
      role: "Security Student",
      content: "Learning about penetration testing and system hardening through LOSL-C has opened up new career opportunities for me in cybersecurity.",
      avatar: "🛡️"
    },
    {
      role: "Community Member",
      content: "Thanks a lot, for you it might be small but for me, it was great, thanks for the dedication you put into your webinars",
      avatar: "👩‍💼"
    },
    {
      role: "Linux & Security Expert",
      content: "The knowledge sharing here is incredible. Everyone is so welcoming and willing to help newcomers learn both Linux and cybersecurity",
      avatar: "🎓"
    },
    {
      role: "Community Member",
      content: "I've learned more about Linux security in the past few weeks here than I did in months of trying to figure it out alone",
      avatar: "👨‍🔧"
    },
    {
      role: "Open Source Advocate",
      content: "The workshops on secure coding and open-source security tools are fantastic. The community spirit is what makes this place special.",
      avatar: "👩‍🎓"
    },
    {
      role: "Community Member",
      content: "Found my passion for secure open-source development through this community. The mentorship and cybersecurity focus is amazing",
      avatar: "🧑‍🚀"
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  return (
    <section className="w-full py-16 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real people who are part of our amazing LOSL-C family
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="hover:scale-105 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentIndex === totalPages - 1}
              className="hover:scale-105 transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <div className="flex">
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div 
                    key={pageIndex}
                    className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
                  >
                    {testimonials
                      .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                      .map((testimonial, index) => (
                        <Card 
                          key={`${pageIndex}-${index}`}
                          className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <Quote className="w-8 h-8 text-primary" />
                            </div>
                            
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              &quot;{testimonial.content}&quot;
                            </p>
                            
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl mr-4">
                                {testimonial.avatar}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{testimonial.role}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
