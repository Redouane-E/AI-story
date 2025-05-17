import { Card, CardContent } from "@/components/ui/card";
import { type Feature } from "@/types";

interface FeatureSectionProps {
  features: Feature[];
}

export default function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <section className="mb-16">
      <h2 className="font-heading text-3xl font-bold mb-8 text-center text-foreground">
        Magical Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="bg-white rounded-xl shadow-md p-6 text-center transition-transform hover:-translate-y-1"
          >
            <CardContent className="p-0">
              <div className={`mb-4 ${feature.color}`}>
                <i className={`${feature.icon} text-4xl`}></i>
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="font-body text-gray-600">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
