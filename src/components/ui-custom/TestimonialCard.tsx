import React from "react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  image,
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-card p-8 rounded-2xl transition-all duration-300",
        className,
      )}
    >
      <div className="mb-6">
        <svg
          width="45"
          height="36"
          viewBox="0 0 45 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary/30"
        >
          <path
            d="M13.5 0C6.04219 0 0 6.04219 0 13.5C0 20.9578 6.04219 27 13.5 27C20.9578 27 27 20.9578 27 13.5C27 13.3865 26.999 13.273 26.9971 13.1596C26.7955 5.79833 20.9287 0 13.5 0ZM13.5 22.5C8.53242 22.5 4.5 18.4676 4.5 13.5C4.5 8.53242 8.53242 4.5 13.5 4.5C18.4676 4.5 22.5 8.53242 22.5 13.5C22.5 18.4676 18.4676 22.5 13.5 22.5Z"
            fill="currentColor"
          />
          <path
            d="M31.5 0C24.0422 0 18 6.04219 18 13.5C18 20.9578 24.0422 27 31.5 27C38.9578 27 45 20.9578 45 13.5C45 13.3865 44.999 13.273 44.9971 13.1596C44.7955 5.79833 38.9287 0 31.5 0ZM31.5 22.5C26.5324 22.5 22.5 18.4676 22.5 13.5C22.5 8.53242 26.5324 4.5 31.5 4.5C36.4676 4.5 40.5 8.53242 40.5 13.5C40.5 18.4676 36.4676 22.5 31.5 22.5Z"
            fill="currentColor"
          />
          <path
            d="M13.5 31.5C11.8455 31.5 10.5 32.8455 10.5 34.5C10.5 34.8978 10.658 35.2794 10.9393 35.5607C11.2206 35.842 11.6022 36 12 36H15C15.3978 36 15.7794 35.842 16.0607 35.5607C16.342 35.2794 16.5 34.8978 16.5 34.5C16.5 32.8455 15.1545 31.5 13.5 31.5Z"
            fill="currentColor"
          />
          <path
            d="M31.5 31.5C29.8455 31.5 28.5 32.8455 28.5 34.5C28.5 34.8978 28.658 35.2794 28.9393 35.5607C29.2206 35.842 29.6022 36 30 36H33C33.3978 36 33.7794 35.842 34.0607 35.5607C34.342 35.2794 34.5 34.8978 34.5 34.5C34.5 32.8455 33.1545 31.5 31.5 31.5Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <p className="text-foreground/90 mb-6 leading-relaxed">{quote}</p>

      <div className="flex items-center">
        {image ? (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img
              src={image}
              alt={author}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary font-medium">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-muted-foreground text-sm">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
