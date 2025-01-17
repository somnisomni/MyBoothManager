# 임시 도움말

## 서비스 사용 시 권장 사항
  - **서비스의 컨셉 및 기능 구현 상 인터넷 연결이 필수입니다.**
    <span style="color: orangered;">행사 현장에서의 인터넷 가용성이 불안정할 수 있다는 점을 잘 이해하고 있으며, 그러한 현장 환경 속에서도 판매 기록 등록 등 중요 기능이 원활하게 작동할 수 있도록 서비스 개발을 진행하고 있습니다.</span>
    붐비는 행사 현장에서 모바일 셀룰러<small>(데이터)</small> 통신을 통해 인터넷에 접속하는 경우, 3G/LTE 망은 포화 상태에 가까울 수 있으니 가능하다면 5G 망을 사용하는 것을 권장합니다.
  - **POS 페이지는 태블릿 PC 이상의 대화면 기기로 이용할 것을 권장합니다.**
    <span style="color: orangered;">서비스의 특성 상 태블릿 PC 또는 노트북 등 대화면 기기로 서비스를 이용할 것을 상정하고 개발 중입니다.</span>
    스마트폰 등 소형 화면 기기에 대해서도 레이아웃을 대응하고 있지만, 불편한 점이 있을 수 있습니다.
  - **만일을 대비해 수기 작성 가능한 필기구를 준비하세요.**
    <span style="color: orangered;">수기 작성이 필요하지 않을 만큼 안정적인 서비스를 만드는 것을 목표로 하고 있지만, 상기한 바와 같이 인터넷 가용성이 불안해지는 등 외적인 문제 요인은 언제든지 발생할 수 있습니다.</span>
    이 서비스에 100% 의존하는 것보단 사용자의 부스가 원활히 운영되는 것이 1순위입니다. 

<br />

## 사용 예시 시나리오
> 이 사용 시나리오는 서비스의 개발 의도가 반영된 내용이자 예시이며, 실사용에 참고만 해주시기 바랍니다.

  1. **부스 생성**
     - 이 서비스는 <u>행사마다 부스를 생성</u>하는 것을 상정하여 개발되었습니다.
       이전 행사의 부스와 동일한 부스명 또는 동일한 굿즈 구성으로 새로 운영한다고 하더라도 행사가 다르다면, **기존 부스를 재사용하지 않고 새로운 부스를 생성하기를 권장**합니다.
  2. **부스 정보 입력**
     - 부스 생성 시 입력했던 기본 정보에 더해, [부스 정보 / 인포 페이지](/info)에서 **부스 참여 멤버**, **배너(현수막) 이미지**, **인포 이미지** 등을 추가로 등록할 수 있습니다.
     - 등록한 이미지와 멤버 정보는 부스 공개 페이지에 표시됩니다.
  3. **굿즈 및 굿즈 세트 구성 등록**
     - 부스에서 판매할 굿즈들과 굿즈 세트 구성을 [굿즈 페이지](/goods)에서 등록할 수 있습니다.
     - 굿즈 카테고리는 굿즈 생성 또는 수정 창에서 추가할 수 있습니다.
       카테고리 이름으로는 여러 장르를 취급할 경우 장르명을, 단일 장르만 취급할 경우 굿즈 종류명으로 사용하는 것을 추천합니다.
     - 굿즈 생성 또는 수정 시 소유자 멤버를 지정할 수 있습니다.
       소유자 멤버를 지정하면 [정산 페이지](/closing)에서 멤버별 수익을 확인하는 데에 용이합니다.
  4. **부스 공개 페이지 확인**
     - 부스를 공개 상태로 설정하거나 부스가 운영 중 상태인 경우, 좌측 내비게이션 바 최하단의 *"부스 공개 페이지 열기"* 메뉴를 클릭하면 부스 공개 페이지를 엽니다.
     - URL 주소를 복사하거나 페이지 내 공유 버튼을 통해 부스 공개 페이지를 일반 사용자들에게 공유할 수 있습니다.
  5. **현장에서 판매 모드(POS) 사용**
     - 행사 현장에서 부스 운영을 시작할 때 부스 상태를 "운영 중"으로 설정하고, [POS 페이지](/pos)로 이동해 판매 기록 등록을 시작합니다.
  6. **부스 운영 종료 및 정산 결과 확인**
     - 굿즈 판매 및 부스 운영을 종료한 후, [판매 기록 페이지](/orders), [통계 페이지](/analytics), [정산 페이지](/closing) 등을 통해 판매 실적을 확인하실 수 있습니다.

<br />

## 부스 운영 상태
부스 운영 상태는 **"운영 준비 중"**, **"운영 중"**, **"운영 일시 중지"**, **"운영 종료"** 총 4가지로 구분되어 있고, [대시보드 페이지](/)에서 변경할 수 있습니다.

<br />

각 운영 상태는 다음과 같은 의미를 가집니다.
<table>
 <tr>
   <th style="width: 15%">"운영 준비 중"</th>
   <td>부스가 실제 운영되기 전 상태입니다. 이 상태에서는 부스 공개 페이지의 공개 여부를 추가로 설정할 수 있습니다.</td>
 </tr>
 <tr>
   <th>"운영 중"</th>
   <td>
     부스가 실제 운영 중인 상태입니다. <u>이 상태에서만 <a href="/pos">현장용 판매 모드(POS)</a> 페이지를 열람할 수 있습니다.</u> <br />
     부스 공개 페이지는 무조건 공개 상태가 됩니다.
   </td>
 </tr>
<tr>
   <th>"운영 일시 중지"</th>
   <td>
     부스가 일시적으로 운영이 중지된 상태입니다. 상태 설정 시 일시 중지 사유를 선택적으로 입력할 수 있고, 입력한 사유가 부스 공개 페이지에 표시됩니다. <br />
     며칠 간 연이어 운영하는 부스가 당일 행사 시간이 종료되어 다음 날 운영을 준비하게 될 때와 같은 상황에 사용할 수 있습니다.
   </td>
</tr>
<tr>
  <th>"운영 종료"</th>
  <td>
     부스 운영이 완전히 종료된 상태입니다. <br />
     이 상태의 부스는 공개 사이트의 부스 목록에서 표시되지 않지만, 개별 부스 공개 페이지의 URL로 직접 접속하면 부스 정보를 열람할 수 있습니다.
   </td>
 </tr>
</table>

<br />

## 이미지 업로드
사용자가 이 서비스에 업로드하는 모든 이미지는 사이트 반응 속도 개선 및 원본 이미지 크롤링 방지를 위해 **미리 지정된 형식으로 변환되어 서버에 저장**됩니다.
이미지의 원본 또는 원본의 사본은 서버에 저장되지 않으며, 사용자는 이미지를 업로드할 때 사용자가 이미지 원본을 요청하더라도 제공해드릴 수 없다는 것에 동의한 것으로 간주합니다.
서버에 저장된 이미지를 지우고 싶은 경우, 해당 이미지를 사용하는 항목에서 이미지를 제거하면 서버에서도 자동으로 삭제됩니다.
업로드된 이미지는 이 서비스 내에서만 정보 표시용으로 사용되며, AI 학습 및 활용 서비스를 포함한 타 서비스나 제3자 개인 또는 단체에게 제공하지 않습니다.

<br />

현재 이미지 업로드 시 손실 포맷인 [WebP](https://ko.wikipedia.org/wiki/WebP), [JPEG](https://ko.wikipedia.org/wiki/JPEG)로 변환되어 서버에 저장되며, 변환 과정에서 투명도가 있는 이미지는 배경이 흰색으로 지정됩니다. 이미지 크기는 다음과 같이 조절됩니다.
<table>
  <tr>
    <th>부스 배너 이미지</th>
    <td>비율을 유지한 채로 <u>세로 최대 600px</u></td>
  </tr>
  <tr>
    <th>부스 인포 이미지</th>
    <td>비율을 유지한 채로 <u>가로 최대 1500px</u></td>
  </tr>
  <tr>
    <th>부스 멤버 아바타 이미지</th>
    <td>이미지 중앙을 기준으로 1:1 비율로 이미지를 자른 후 <u>가로 및 세로 300px</u>로 사이즈 조정</td>
  </tr>
  <tr>
    <th>굿즈 및 굿즈 세트 이미지</th>
    <td>비율을 유지한 채로 <u>가로 최대 1500px, 세로 최대 500px</u> 이내</td>
  </tr>
</table>

이 내용은 [소스 코드](https://github.com/somnisomni/MyBoothManager/blob/main/packages/Common/src/utils/image-size-constraints.ts)에서도 확인하실 수 있습니다.

<br />

## 소스 코드
이 서비스는 소스 코드를 [PolyForm Strict 라이선스](https://github.com/somnisomni/MyBoothManager/blob/main/LICENSE-ko.md) 하에 공개하고 있는 **[소스 입수 가능 소프트웨어](https://ko.wikipedia.org/wiki/%EC%86%8C%EC%8A%A4_%EC%9E%85%EC%88%98_%EA%B0%80%EB%8A%A5_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4)** 입니다.
[GitHub 레포지토리](https://github.com/somnisomni/MyBoothManager)에서 이 서비스의 소스코드를 확인하실 수 있습니다.
