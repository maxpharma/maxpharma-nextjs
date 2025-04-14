"use client";

import Button from "@/components/Button";
import CustomImage from "@/components/CustomImage";
import { useRouter } from "next/navigation";

const Products = ({ limit = 10 }: { limit?: number }) => {
  const data = [
    {
      id: 1,
      title: "Levotech IV-500mg",
      image: "/images/banner4.png",
      description: "(Levofloxacin) - Antibiotic (Fluoroquinolone)",
      header: "Antibiotics & Antimicrobials",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 ">
      {Array(limit)
        .fill(data)
        .map((item) => (
          <Items key={item[0].title} {...item[0]} />
        ))}
    </div>
  );
};

export default Products;

const Items = ({ header, title, description, image, id }: any) => {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col gap-4 border border-slate-300 rounded-xl max-w-sm cursor-pointer"
      onClick={() => router.push(`/products/${id}`)}
    >
      <div className="px-4 pt-4 pb-8 w-full space-y-4 ">
        <div className="relative">
          <CustomImage src={image} fit="cover" className="w-full h-40" />
          <div className="absolute top-2 left-2 rounded-xl p-1 bg-[#FAFBEA]">
            {header}
          </div>
        </div>
        <div>
          <div className="text-lg">{title}</div>
          <span className="text-sm">{description}</span>
        </div>
      </div>
      <Button className="absolute -bottom-6 right-4">Send Inquiry</Button>
    </div>
  );
};
