# Website VinFast SAMCO Bình Tân

Địa chỉ: https://vinfastsamcobinhtan.com

Giao diện (GitHub Pages) → Apps Script (API) → Google Sheet "Website VinFast SAMCO Bình Tân".

## Sửa nội dung hằng ngày
Sửa trên Sheet, web đổi sau vài giây, không cần đụng code.
- Giá, ưu đãi: `PHIEN_BAN`. Ngừng bán một bản: `Hiện web` = Không.
- Gói vay: `GOI_VAY`, mỗi gói một dòng.
- Tin tức: `TIN_TUC`, đổi `Trạng thái` thành `Đã đăng`. Trang riêng cho Google được tạo trong vòng 6 giờ.
- Đăng ký của khách: `DANG_KY`. Sheet này không được chia sẻ công khai.

Cách viết nội dung bài: cách một dòng trống để sang đoạn mới.
- Bảng: mỗi dòng dạng `Tên | Giá trị`, dòng tổng thêm `= ` ở đầu.
- Ghi chú nhỏ: bắt đầu bằng `~ `.
- Link: `[chữ hiện](/vf3/)`.

## Cấu trúc
- `assets/`: giao diện, ảnh xe, `cauhinh.js` chứa link API.
- `du-lieu/mac-dinh.json`: dữ liệu dự phòng khi không gọi được Sheet.
- `nguon/khung.html`, `tools/dung_web.py`: tạo trang riêng từng xe, từng bài, sitemap.
- `apps-script/`: `Code.gs` (API), `KhoiTao.gs` (tạo Sheet, chỉ chạy một lần).
- `.github/workflows/dang-web.yml`: tự đăng web khi có thay đổi và mỗi 6 giờ.

## Phiên bản
- v1.0 (05/11/2026): bản đầu tiên, 12 xe, tính trả góp, đăng ký tư vấn và lái thử, tin tức, song ngữ, 3 chế độ sáng tối.
