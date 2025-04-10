"use client";

import Image from "next/image";
import { useMapStore } from "../../store/map-store";

export default function Legend() {
  const { showLegend } = useMapStore();

  if (!showLegend) return null;

  return (
    <div className="bg-orange-500 p-5 rounded-lg shadow-md z-10 text-white w-80">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <Image
            src="/green-cabinet.png"
            alt="사용가능"
            width={40}
            height={50}
            className="h-10 mr-3"
          />
          <span className="text-base">사용가능</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/red-cabinet.png"
            alt="거의찬 상태"
            width={40}
            height={50}
            className="h-10 mr-3"
          />
          <span className="text-base">거의찬 상태</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/black-cabinet.png"
            alt="구매불가"
            width={40}
            height={50}
            className="h-10 mr-3"
          />
          <span className="text-base">구매불가</span>
        </div>
      </div>
    </div>
  );
}
