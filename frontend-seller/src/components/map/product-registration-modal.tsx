"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Camera, Trash2, Plus, Loader2 } from "lucide-react";
import { useSlotStore } from "../../store/slot-store";
import { useBreadStore } from "../../store/bread-store";
import {
  BreadType,
  type BreadTypeOption,
  type BreadInfo,
} from "../../types/bread";
import { analyzeBreadImage, validateBreadType } from "../../api/bread-api";
import { createOrder } from "../../api/product-api";
import { useLoading } from "../../components/loading-provider";
import InvalidBreadModal from "./invalid-bread-modal";
import Image from "next/image";

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendingMachineName: string;
  vendingMachineAddress: string;
  slotNumber: number;
}

export default function ProductRegistrationModal({
  isOpen,
  onClose,
  vendingMachineName,
  vendingMachineAddress,
  slotNumber,
}: ProductRegistrationModalProps) {
  // 로딩 상태 관리
  const { setLoading } = useLoading();

  // 슬롯 정보 가져오기
  const { slots } = useSlotStore();

  // 빵 상태 관리
  const {
    breadInfo,
    setBreadInfo,
    image,
    setImage,
    isInvalidBread,
    setIsInvalidBread,
    breadList,
    addBread,
    removeBread,
    clearBreadList,
    resetBreadInfo,
  } = useBreadStore();

  // 현재 슬롯의 spaceId 찾기
  const currentSlot = slots.find((slot) => slot.slotNumber === slotNumber);
  const spaceId = currentSlot?.spaceId;

  // 로컬 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 여러 빵 정보를 관리하기 위한 상태 추가
  const [breadForms, setBreadForms] = useState<BreadInfo[]>([defaultBreadInfo]);

  // 빵 종류 옵션
  const breadTypeOptions: BreadTypeOption[] = [
    { value: BreadType.SOBORO, label: "소보로빵" },
    { value: BreadType.SWEET_RED_BEAN, label: "단팥빵" },
    { value: BreadType.WHITE_BREAD, label: "식빵" },
    { value: BreadType.BAGUETTE, label: "바게트" },
    { value: BreadType.CROISSANT, label: "크루아상" },
    { value: BreadType.PIZZA_BREAD, label: "피자빵" },
    { value: BreadType.BAGEL, label: "베이글" },
    { value: BreadType.GARLIC_BREAD, label: "마늘빵" },
    { value: BreadType.OTHER, label: "기타" },
  ];

  // AI 분석 결과를 BreadType으로 변환하는 함수
  const mapClassificationToBreadType = (classification: string): BreadType => {
    switch (classification.toLowerCase()) {
      case "bagel":
        return BreadType.BAGEL;
      case "baguette":
        return BreadType.BAGUETTE;
      case "croissant":
        return BreadType.CROISSANT;
      case "pizzabread":
        return BreadType.PIZZA_BREAD;
      case "soboro":
        return BreadType.SOBORO;
      default:
        return BreadType.OTHER;
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  // 모달 닫기 처리
  const handleClose = () => {
    resetBreadInfo();
    clearBreadList();
    setBreadForms([defaultBreadInfo]);
    onClose();
  };

  // 가격과 할인률 연동 처리 - 개선된 버전
  useEffect(() => {
    const { originalPrice, discountRate, finalPrice } = breadInfo;

    // 원가와 할인율이 있을 때 최종 가격 계산
    if (originalPrice !== "" && discountRate !== "" && finalPrice === "") {
      const calculatedPrice = Math.round(
        Number(originalPrice) * (1 - Number(discountRate) / 100)
      );
      setBreadInfo({ finalPrice: calculatedPrice });
    }
    // 원가와 최종 가격이 있을 때 할인율 계산
    else if (originalPrice !== "" && finalPrice !== "" && discountRate === "") {
      const original = Number(originalPrice);
      const final = Number(finalPrice);

      if (original > 0 && final >= 0 && final <= original) {
        const calculatedRate = Math.round((1 - final / original) * 100);
        setBreadInfo({ discountRate: calculatedRate });
      }
    }
  }, [breadInfo, setBreadInfo]);

  // 원래 가격 변경 핸들러
  const handleOriginalPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setBreadInfo({ originalPrice: value });

    // 할인율이 있으면 최종 가격 자동 계산
    if (breadInfo.discountRate !== "") {
      const calculatedPrice = Math.round(
        Number(value) * (1 - Number(breadInfo.discountRate) / 100)
      );
      setBreadInfo({ originalPrice: value, finalPrice: calculatedPrice });
    }
  };

  // 할인률 변경 핸들러
  const handleDiscountRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setBreadInfo({ discountRate: value });

    // 원가가 있으면 최종 가격 자동 계산
    if (breadInfo.originalPrice !== "") {
      const calculatedPrice = Math.round(
        Number(breadInfo.originalPrice) * (1 - Number(value) / 100)
      );
      setBreadInfo({ discountRate: value, finalPrice: calculatedPrice });
    }
  };

  // 최종 가격 변경 핸들러
  const handleFinalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setBreadInfo({ finalPrice: value });

    // 원가가 있으면 할인율 자동 계산
    if (breadInfo.originalPrice !== "") {
      const original = Number(breadInfo.originalPrice);
      const final = Number(value);

      if (original > 0 && final >= 0 && final <= original) {
        const calculatedRate = Math.round((1 - final / original) * 100);
        setBreadInfo({ finalPrice: value, discountRate: calculatedRate });
      }
    }
  };

  // 수량 증가 핸들러
  const handleIncreaseQuantity = () => {
    setBreadInfo({ quantity: breadInfo.quantity + 1 });
  };

  // 수량 감소 핸들러
  const handleDecreaseQuantity = () => {
    if (breadInfo.quantity > 1) {
      setBreadInfo({ quantity: breadInfo.quantity - 1 });
    }
  };

  // 이미지 업로드 및 AI 분석 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setRawFile(file);

    // 로딩 시작
    setLoading(true);

    try {
      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // 빵 등록 가능 여부 확인 API 호출
      const validationResult = await validateBreadType(file);

      if (validationResult.containsBadBread) {
        // 등록 불가능한 빵 (containsBadBread가 true면 나쁜 빵이 포함되어 있음)
        setIsInvalidBread(true);
        setShowInvalidModal(true);
      } else {
        // 등록 가능한 빵, 빵 종류 분석 API 호출
        const analysisResult = await analyzeBreadImage(file);

        if (analysisResult.breads && analysisResult.breads.length > 0) {
          // 감지된 모든 빵 종류에 대한 폼 생성
          const newBreadForms = analysisResult.breads.map((bread) => {
            const breadType = mapClassificationToBreadType(
              bread.classification
            );
            return {
              breadType: breadType,
              originalPrice: "",
              discountRate: "",
              finalPrice: "",
              quantity: bread.stock > 0 ? bread.stock : 1,
              productName: getBreadTypeName(breadType), // 빵 종류에 따른 기본 상품명 설정
            } as BreadInfo;
          });

          // 빵 폼 상태 업데이트
          setBreadForms(newBreadForms);

          // 기존 빵 목록 초기화
          clearBreadList();
        }
      }
    } catch (error) {
      console.error("이미지 분석 중 오류 발생:", error);
    } finally {
      // 로딩 종료
      setLoading(false);
    }
  };

  // 빵 종류에 따른 한글 이름 반환 함수 추가
  const getBreadTypeName = (breadType: BreadType): string => {
    const breadTypeMap: Record<BreadType, string> = {
      [BreadType.SOBORO]: "소보로빵",
      [BreadType.SWEET_RED_BEAN]: "단팥빵",
      [BreadType.WHITE_BREAD]: "식빵",
      [BreadType.BAGUETTE]: "바게트",
      [BreadType.CROISSANT]: "크루아상",
      [BreadType.PIZZA_BREAD]: "피자빵",
      [BreadType.BAGEL]: "베이글",
      [BreadType.GARLIC_BREAD]: "마늘빵",
      [BreadType.OTHER]: "기타 빵",
    };
    return breadTypeMap[breadType] || "빵";
  };

  // 카메라 열기 핸들러
  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = () => {
    setImage(null);
    setRawFile(null);
    setIsInvalidBread(false);

    // 파일 입력 요소의 값을 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 빵 추가 핸들러
  const handleAddBread = () => {
    // 필수 필드 검증
    if (
      breadInfo.originalPrice === "" ||
      breadInfo.finalPrice === "" ||
      !breadInfo.productName
    ) {
      alert("상품명, 원가, 가격을 모두 입력해주세요.");
      return;
    }

    // 빵 목록에 추가
    addBread({ ...breadInfo });

    // 폼 초기화 (이미지는 유지)
    setBreadInfo({
      ...defaultBreadInfo,
      productName: "", // 상품명 초기화
    });
  };

  // 추가: 다음 빵 종류 선택 함수
  const handleNextBreadType = () => {
    if (!rawFile) return;

    // 로딩 시작
    setLoading(true);

    try {
      // 이미 분석된 결과를 사용하여 다음 빵 종류 선택
      analyzeBreadImage(rawFile).then((analysisResult) => {
        if (analysisResult.breads && analysisResult.breads.length > 1) {
          // 이미 추가된 빵 종류들
          const addedBreadTypes = breadList.map((bread) => bread.breadType);

          // 현재 폼에 있는 빵 종류도 추가된 것으로 간주
          if (breadInfo.productName) {
            addedBreadTypes.push(breadInfo.breadType);
          }

          // 아직 추가되지 않은 빵 종류 찾기
          for (const bread of analysisResult.breads) {
            const breadType = mapClassificationToBreadType(
              bread.classification
            );

            // 아직 추가되지 않은 빵 종류라면 폼에 설정
            if (!addedBreadTypes.includes(breadType)) {
              setBreadInfo({
                ...defaultBreadInfo,
                breadType: breadType,
                quantity: bread.stock > 0 ? bread.stock : 1,
                productName: getBreadTypeName(breadType),
              });
              break;
            }
          }
        }
      });
    } catch (error) {
      console.error("다음 빵 종류 선택 중 오류 발생:", error);
    } finally {
      // 로딩 종료
      setLoading(false);
    }
  };

  // 특정 인덱스의 빵 폼 업데이트 함수
  const updateBreadForm = (index: number, updates: Partial<BreadInfo>) => {
    setBreadForms((prevForms) => {
      const newForms = [...prevForms];
      newForms[index] = { ...newForms[index], ...updates };
      return newForms;
    });
  };

  // 특정 인덱스의 빵 폼 삭제 함수
  const removeBreadForm = (index: number) => {
    setBreadForms((prevForms) => prevForms.filter((_, i) => i !== index));
  };

  // 새 빵 폼 추가 함수
  const addNewBreadForm = () => {
    setBreadForms((prevForms) => [...prevForms, { ...defaultBreadInfo }]);
  };

  // 제품 등록 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 등록할 빵이 없는 경우
    if (breadForms.length === 0) {
      alert("등록할 빵 정보가 없습니다.");
      return;
    }

    // 필수 필드 검증
    const invalidForms = breadForms.filter(
      (form) =>
        form.originalPrice === "" || form.finalPrice === "" || !form.productName
    );

    if (invalidForms.length > 0) {
      alert("모든 빵의 상품명, 원가, 가격을 입력해주세요.");
      return;
    }

    if (!image || !rawFile) {
      alert("상품 이미지를 업로드해주세요.");
      return;
    }

    if (!spaceId) {
      alert("슬롯 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 첫 번째 빵 등록
      const firstBread = breadForms[0];

      console.log("상품 등록 시작:", {
        spaceId,
        productName: firstBread.productName,
        originalPrice: Number(firstBread.originalPrice),
        discountRate: Number(firstBread.discountRate || 0),
        finalPrice: Number(firstBread.finalPrice),
        quantity: firstBread.quantity,
        breadType: firstBread.breadType,
      });

      // API 호출
      await createOrder({
        spaceId,
        productName: firstBread.productName,
        originalPrice: Number(firstBread.originalPrice),
        discountRate: Number(firstBread.discountRate || 0),
        finalPrice: Number(firstBread.finalPrice),
        quantity: firstBread.quantity,
        breadType: String(firstBread.breadType), // BreadType을 String으로 변환
        image: rawFile,
      });

      // 성공 시 모달 닫기
      alert("상품이 성공적으로 등록되었습니다.");
      handleClose();
    } catch (error) {
      console.error("상품 등록 중 오류 발생:", error);
      if (error instanceof Error) {
        alert(`상품 등록 중 오류가 발생했습니다: ${error.message}`);
      } else {
        alert("상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[80vw] max-h-[90vh] overflow-hidden">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-orange-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {vendingMachineName}
              </h2>
              <p className="text-sm text-gray-600">{vendingMachineAddress}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 내용 - 가로 레이아웃 */}
          <div className="flex flex-row">
            {/* 왼쪽 - 이미지 */}
            <div className="w-1/3 p-6 border-r border-gray-200 flex flex-col items-center justify-center">
              {image ? (
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt="상품 이미지"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleOpenCamera}
                  className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500 transition-colors cursor-pointer mb-4"
                >
                  <Camera className="w-16 h-16 mb-2" />
                  <span className="text-sm">사진 추가</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* 오른쪽 - 상품 정보 테이블 */}
            <div className="w-2/3 p-6 overflow-y-auto max-h-[70vh]">
              {/* 빵 폼 목록 */}
              {breadForms.map((breadForm, index) => (
                <div
                  key={index}
                  className="mb-8 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      빵 #{index + 1}
                    </h3>
                    {breadForms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBreadForm(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-4 mb-4 font-medium text-gray-700 text-center">
                    <div>빵 종류</div>
                    <div>원가</div>
                    <div>가격</div>
                    <div>수량</div>
                    <div>할인률</div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 items-center mb-4">
                    <div>
                      <select
                        value={breadForm.breadType}
                        onChange={(e) =>
                          updateBreadForm(index, {
                            breadType: e.target.value as BreadType,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {breadTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={breadForm.originalPrice}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value);
                            updateBreadForm(index, { originalPrice: value });

                            // 할인율이 있으면 최종 가격 자동 계산
                            if (breadForm.discountRate !== "") {
                              const calculatedPrice = Math.round(
                                Number(value) *
                                  (1 - Number(breadForm.discountRate) / 100)
                              );
                              updateBreadForm(index, {
                                originalPrice: value,
                                finalPrice: calculatedPrice,
                              });
                            }
                          }}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="ml-1 text-gray-600">원</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={breadForm.finalPrice}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value);
                            updateBreadForm(index, { finalPrice: value });

                            // 원가가 있으면 할인율 자동 계산
                            if (breadForm.originalPrice !== "") {
                              const original = Number(breadForm.originalPrice);
                              const final = Number(value);

                              if (
                                original > 0 &&
                                final >= 0 &&
                                final <= original
                              ) {
                                const calculatedRate = Math.round(
                                  (1 - final / original) * 100
                                );
                                updateBreadForm(index, {
                                  finalPrice: value,
                                  discountRate: calculatedRate,
                                });
                              }
                            }
                          }}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="ml-1 text-gray-600">원</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (breadForm.quantity > 1) {
                            updateBreadForm(index, {
                              quantity: breadForm.quantity - 1,
                            });
                          }
                        }}
                        disabled={breadForm.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={breadForm.quantity}
                        onChange={(e) =>
                          updateBreadForm(index, {
                            quantity: Math.max(1, Number(e.target.value)),
                          })
                        }
                        min="1"
                        className="w-12 h-8 px-2 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateBreadForm(index, {
                            quantity: breadForm.quantity + 1,
                          })
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        value={breadForm.discountRate}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? "" : Number(e.target.value);
                          updateBreadForm(index, { discountRate: value });

                          // 원가가 있으면 최종 가격 자동 계산
                          if (breadForm.originalPrice !== "") {
                            const calculatedPrice = Math.round(
                              Number(breadForm.originalPrice) *
                                (1 - Number(value) / 100)
                            );
                            updateBreadForm(index, {
                              discountRate: value,
                              finalPrice: calculatedPrice,
                            });
                          }
                        }}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-16 px-2 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="ml-1 text-gray-600">%</span>
                    </div>
                  </div>

                  {/* 상품명 입력 */}
                  <div>
                    <label
                      htmlFor={`productName-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      상품명
                    </label>
                    <input
                      type="text"
                      id={`productName-${index}`}
                      value={breadForm.productName}
                      onChange={(e) =>
                        updateBreadForm(index, { productName: e.target.value })
                      }
                      placeholder="상품명을 자유롭게 입력해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              ))}

              {/* 새 빵 추가 버튼 */}
              <button
                type="button"
                onClick={addNewBreadForm}
                className="w-full py-3 mb-6 rounded-md border border-dashed border-orange-300 bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-1" />새 빵 추가
              </button>

              {/* 총 금액 표시 */}
              <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-md">
                <div>
                  <span className="text-sm text-gray-600">총 상품 수</span>
                  <div className="text-xl font-bold text-gray-800">
                    {breadForms.length}개
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">총 수량</span>
                  <div className="text-xl font-bold text-gray-800">
                    {breadForms.reduce(
                      (total, form) => total + form.quantity,
                      0
                    )}
                    개
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="p-4 border-t border-gray-200">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !image || isInvalidBread}
              className="w-full py-4 rounded-md font-bold shadow-md flex items-center justify-center text-white text-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  등록 중...
                </>
              ) : (
                "제품 등록하기"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 등록 불가능한 빵 모달 */}
      <InvalidBreadModal
        isOpen={showInvalidModal}
        onClose={() => setShowInvalidModal(false)}
      />
    </>
  );
}

// 기본 빵 정보
const defaultBreadInfo: BreadInfo = {
  breadType: BreadType.SOBORO,
  originalPrice: "",
  discountRate: "",
  finalPrice: "",
  quantity: 1,
  productName: "",
};
