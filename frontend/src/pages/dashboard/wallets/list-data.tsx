import React from "react";
import Image from "@/components/ui/image";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface ListDataProps {
  image: string;
  name: string;
  date: Date;
  amount: number;
}

const ListData: React.FC<ListDataProps> = ({ image, name, date, amount }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Image
          src={image}
          alt="Payment"
          height={40}
          width={40}
          className="rounded-full object-center object-cover flex-shrink-0"
        />
        <div>
          <span className="font-medium">{name}</span>
          <p className="text-sm text-secondary">
            {format(date, "dd MMM yyyy, hh:mm a")}
          </p>
        </div>
      </div>
      <div>
        <span className="font-medium">+ {formatCurrency(amount)}</span>
      </div>
    </div>
  );
};

export default ListData;
