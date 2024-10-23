import { useState } from "react";

type AccordionItem = {
  title: string;
  content: { time: string; details: string }[];
};

type AccordionProps = {
  items: AccordionItem[];
};

export const Accordion = ({ items }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <div
            className="rounded-lg py-2 px-4 border-b border-gray-400 bg-gray-200"
            onClick={() => handleClick(index)}
          >
            <div className="flex justify-between items-center cursor-pointer">
              <span>{item.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  index === activeIndex ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              index === activeIndex
                ? "max-h-screen bg-gray-100 border"
                : "max-h-0"
            }`}
          >
            <div className="px-4 py-2">
              {item.content.map((subItem: any, subIndex: any) => (
                <ol key={subIndex} className="list-disc px-1">
                  <li className="border-b mb-1">
                    <span className="font-medium">{subItem.time}</span>
                    {" - "}
                    {subItem.details}
                  </li>
                </ol>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// BOTH ACCORDION CAN OPEN AT SAME TIME
type AccordionItemBothOpen = {
  title: string;
  content: { details: string }[];
};

type AccordionBothOpenProps = {
  items: AccordionItemBothOpen[];
};

export const AccordionFAQ = ({ items }: AccordionBothOpenProps) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  const handleClick = (index: number) => {
    if (activeIndices.includes(index)) {
      setActiveIndices(activeIndices.filter((i) => i !== index)); // Close the item
    } else {
      setActiveIndices([...activeIndices, index]); // Open the item
    }
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <div
            className="rounded-lg py-2 px-4 border-b border-gray-400 bg-gray-200"
            onClick={() => handleClick(index)}
          >
            <div className="flex justify-between items-center cursor-pointer">
              <span>{item.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  activeIndices.includes(index) ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              activeIndices.includes(index)
                ? "max-h-screen bg-gray-100 border"
                : "max-h-0"
            }`}
          >
            <div className="px-4 py-2">
              {item.content.map((subItem, subIndex) => (
                <ol key={subIndex} className="list-disc px-1 text-sm">
                  <li className="border-b mb-1">{subItem.details}</li>
                </ol>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
