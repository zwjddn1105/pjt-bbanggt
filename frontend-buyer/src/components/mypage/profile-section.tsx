interface ProfileSectionProps {
    username: string
    profileImage?: string
  }
  
  export function ProfileSection({ username, profileImage }: ProfileSectionProps) {
    return (
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-md overflow-hidden mr-3 bg-gray-200">
            {/* 프로필 이미지 - 실제 구현 시 사용자 이미지로 교체 */}
            <div className="w-full h-full bg-orange-100"></div>
          </div>
          <h1 className="text-lg font-medium">
            {username}님,
            <br />
            반갑습니다!
          </h1>
        </div>
        <button className="px-4 py-1.5 border border-primary-custom text-primary-custom rounded-full text-sm">
          설정
        </button>
      </div>
    )
  }
  
  