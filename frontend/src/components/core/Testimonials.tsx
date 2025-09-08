import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  const testimonials = (t('testimonials.items', { returnObjects: true }) as { role: string; content: string; avatar: string }[]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  return (
    <section className="w-full py-20 px-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('testimonials.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
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
              className="hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('testimonials.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentIndex === totalPages - 1}
              className="hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {t('testimonials.next')}
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
                          className="border border-border/70 bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <Quote className="w-8 h-8 text-primary" />
                            </div>
                            
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              &quot;{testimonial.content}&quot;
                            </p>
                            
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                                <User className="h-6 w-6 text-primary" />
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
                className={`w-2.5 h-2.5 rounded-full ring-1 ring-border transition-all duration-200 cursor-pointer ${
                  index === currentIndex 
                    ? 'bg-primary scale-125 ring-primary/40' 
                    : 'bg-muted hover:bg-primary/40'
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
