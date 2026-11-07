/* Website VinFast SAMCO Bình Tân - API v1.0
   Dán vào Tiện ích mở rộng > Apps Script của Google Sheet.
   Triển khai: Web app, chạy với tài khoản của tôi, ai cũng truy cập được.
   Khách chỉ đọc được giá, màu, tin đã đăng. Sheet DANG_KY không bao giờ trả ra ngoài. */
const TZ = 'Asia/Ho_Chi_Minh';
const API = { getData, guiDangKy };

function doPost(e) {
  let out;
  try {
    const { fn, args } = JSON.parse(e.postData.contents);
    if (!Object.prototype.hasOwnProperty.call(API, fn)) throw 'Chức năng không tồn tại';
    out = { ok: true, data: API[fn].apply(null, args || []) };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
// Mở link /exec trên trình duyệt để kiểm tra nhanh
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, data: 'SAMCO API v1.0' })).setMimeType(ContentService.MimeType.JSON);
}
// Sửa Sheet xong, web cập nhật ngay thay vì chờ hết 5 phút
function onEdit() {
  CacheService.getScriptCache().remove('data');
}

/* ---------- Hàm chung ---------- */
function sh_(ten) {
  const s = SpreadsheetApp.getActive().getSheetByName(ten);
  if (!s) throw 'Thiếu sheet ' + ten + '. Vui lòng kiểm tra tên sheet.';
  return s;
}
function readTable(ten) {
  const v = sh_(ten).getDataRange().getValues();
  const h = v.shift().map(String);
  return v.filter(r => r.some(o => o !== '')).map(r => {
    const o = {};
    h.forEach((k, i) => { o[k] = r[i] instanceof Date ? Utilities.formatDate(r[i], TZ, 'dd/MM/yyyy') : r[i]; });
    return o;
  });
}
function now_() { return Utilities.formatDate(new Date(), TZ, 'dd/MM/yyyy HH:mm:ss'); }
function newId(ten, prefix) {
  const ngay = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd'), dau = prefix + '-' + ngay + '-';
  const so = readTable(ten).map(r => String(r.ID)).filter(i => i.indexOf(dau) === 0).length;
  return dau + String(so + 1).padStart(3, '0');
}
function appendRow(ten, obj) {
  const s = sh_(ten), h = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
  const hang = s.getLastRow() + 1, o = s.getRange(hang, 1, 1, h.length);
  o.setNumberFormat('@'); // giữ số 0 đầu của số điện thoại
  o.setValues([h.map(k => (obj[k] === undefined ? '' : obj[k]))]);
}
function updateRow(ten, id, patch) {
  const s = sh_(ten), v = s.getDataRange().getValues(), h = v[0];
  const i = v.findIndex((r, n) => n && r[0] === id);
  if (i < 0) throw 'Không tìm thấy ' + id;
  Object.keys(patch).forEach(k => { const c = h.indexOf(k); if (c >= 0) s.getRange(i + 1, c + 1).setValue(patch[k]); });
}
const CO_ = v => String(v).trim() === 'Có';
const SO_ = v => Number(String(v).replace(/[.,\s]/g, '')) || 0;
const THAPPHAN_ = v => Number(String(v).replace(',', '.')) || 0;
const TXT_ = v => String(v === undefined || v === null ? '' : v).trim();

function cauHinh_() {
  const c = {};
  readTable('_CauHinh').forEach(r => { c[TXT_(r['Khóa'])] = r['Giá trị']; });
  return c;
}

/* ---------- Đọc dữ liệu cho web ---------- */
function getData() {
  const cache = CacheService.getScriptCache(), luu = cache.get('data');
  if (luu) return JSON.parse(luu);
  const pb = {}, tnds = {};
  readTable('PHIEN_BAN').filter(r => CO_(r['Hiện web'])).forEach(r => {
    const k = TXT_(r['Mã xe']);
    (pb[k] = pb[k] || []).push([TXT_(r['Phiên bản']), SO_(r['Giá niêm yết']), TXT_(r['Bộ ảnh']) || null, THAPPHAN_(r['Ưu đãi (%)']), TXT_(r['Tên EN']) || undefined]);
  });
  readTable('BAO_HIEM').forEach(r => { tnds[TXT_(r['Mã xe'])] = SO_(r['TNDS']); });
  const xe = readTable('XE').map(r => {
    const id = TXT_(r['Mã']);
    return { id, ten: TXT_(r['Tên xe']), loi: TXT_(r['Khẩu hiệu']), loiEn: TXT_(r['Khẩu hiệu EN']), sac: TXT_(r['Ưu đãi sạc']), sacEn: TXT_(r['Ưu đãi sạc EN']),
      laiThu: CO_(r['Lái thử']), traMin: SO_(r['Trả trước tối thiểu (%)']), thuTu: SO_(r['Thứ tự']), hien: CO_(r['Hiện web']), tnds: tnds[id] || 0, pb: pb[id] || [] };
  });
  const mau = {};
  readTable('MAU_XE').filter(r => CO_(r['Hiện web'])).forEach(r => {
    const k = TXT_(r['Mã xe']);
    mau[k] = mau[k] || { l: SO_(r['Chiều dài xe (mm)']), ds: [] };
    mau[k].ds.push({ k: TXT_(r['Mã ảnh']), ten: TXT_(r['Tên màu']), hex: TXT_(r['Mã màu']), noc: TXT_(r['Màu nóc']) || null, f: THAPPHAN_(r['Tỉ lệ thân xe']) || 0.8 });
  });
  const goi = {};
  readTable('GOI_VAY').filter(r => CO_(r['Hiện web'])).forEach(r => {
    goi[TXT_(r['Mã gói'])] = { ten: TXT_(r['Tên gói']), tenEn: TXT_(r['Tên EN']) || TXT_(r['Tên gói']), r1: THAPPHAN_(r['Lãi suất đầu (%/năm)']), n: SO_(r['Số tháng đầu']), r2: THAPPHAN_(r['Lãi suất sau (%/năm)']), nam: SO_(r['Số năm mặc định']) };
  });
  const dn = s => { const m = String(s).split('/'); return m.length === 3 ? m[2] + m[1] + m[0] : ''; };
  const bai = readTable('TIN_TUC').filter(r => TXT_(r['Trạng thái']) === 'Đã đăng').map(r => ({
    slug: TXT_(r['Đường dẫn']), tieu: TXT_(r['Tiêu đề']), tieuEn: TXT_(r['Tiêu đề EN']) || TXT_(r['Tiêu đề']), tom: TXT_(r['Mô tả SEO']), tomEn: TXT_(r['Mô tả EN']) || TXT_(r['Mô tả SEO']),
    nd: TXT_(r['Nội dung']), ndEn: TXT_(r['Nội dung EN']) || TXT_(r['Nội dung']), loai: TXT_(r['Loại']), loaiEn: TXT_(r['Loại EN']) || TXT_(r['Loại']), xe: TXT_(r['Xe']), ngay: TXT_(r['Ngày đăng']), nguon: TXT_(r['Nguồn'])
  })).sort((a, b) => dn(b.ngay).localeCompare(dn(a.ngay)));
  const c = cauHinh_();
  const data = { xe, mau, goi, bai, cauhinh: { sdt: TXT_(c['SĐT']).replace(/\D/g, ''), sdtHien: TXT_(c['SĐT']), diachi: TXT_(c['Địa chỉ']), diachiEn: TXT_(c['Địa chỉ EN']), traMin: SO_(c['Trả trước tối thiểu (%)']) } };
  try { cache.put('data', JSON.stringify(data), 300); } catch (e) {}
  return data;
}

/* ---------- Nhận đăng ký từ form ---------- */
// Chữ bắt đầu bằng = + - @ có thể bị Sheet hiểu là công thức, nên thêm dấu nháy để luôn là chữ
function sach_(v, dai) {
  const s = TXT_(v).slice(0, dai).replace(/[\r\n\t]+/g, ' ');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function guiDangKy(f) {
  f = f || {};
  // Ô ẩn bị điền hoặc gửi quá nhanh là máy tự động: báo thành công để nó không thử lại, không lưu gì
  if (f.web || Number(f.giay) < 2) return { ok: true };
  const ten = sach_(f.ten, 80), sdt = TXT_(f.sdt).replace(/[\s.\-]/g, ''), email = sach_(f.email, 120);
  if (!ten) throw 'Vui lòng nhập tên.';
  if (!/^0\d{9}$/.test(sdt)) throw 'Vui lòng nhập số điện thoại 10 chữ số.';
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw 'Vui lòng kiểm tra email.';
  const xe = readTable('XE').find(r => TXT_(r['Mã']) === TXT_(f.xe));
  if (!xe) throw 'Vui lòng chọn dòng xe.';
  const nhuCau = TXT_(f.nhuCau) === 'Lái thử' && CO_(xe['Lái thử']) ? 'Lái thử' : 'Tư vấn';
  const ngay = /^\d{4}-\d{2}-\d{2}$/.test(TXT_(f.ngay)) ? f.ngay.split('-').reverse().join('/') : '';
  const cache = CacheService.getScriptCache();
  if (cache.get('sdt' + sdt)) return { ok: true }; // bấm gửi 2 lần
  const dem = Number(cache.get('dem') || 0);
  if (dem >= 60) throw 'Hệ thống đang bận. Vui lòng gọi trực tiếp.';
  const khoa = LockService.getScriptLock();
  khoa.waitLock(20000);
  let id;
  try {
    id = newId('DANG_KY', 'DK');
    const luc = now_();
    appendRow('DANG_KY', { 'ID': id, 'Họ tên': ten, 'SĐT': sdt, 'Email': email, 'Dòng xe': TXT_(xe['Tên xe']), 'Nhu cầu': nhuCau, 'Ngày mong muốn': ngay,
      'Trạng thái': 'Chờ gọi', 'Người phụ trách': '', 'Màu': sach_(f.mau, 40), 'Tạo lúc': luc, 'Người tạo': 'Website', 'Cập nhật lúc': luc });
  } finally {
    khoa.releaseLock();
  }
  cache.put('sdt' + sdt, '1', 60);
  cache.put('dem', String(dem + 1), 600);
  try {
    const nhan = TXT_(cauHinh_()['Email nhận đăng ký']);
    if (nhan) MailApp.sendEmail(nhan, 'Khách mới: ' + TXT_(xe['Tên xe']) + ' - ' + nhuCau,
      [id, 'Tên: ' + ten, 'SĐT: ' + sdt, 'Email: ' + email, 'Xe: ' + TXT_(xe['Tên xe']), 'Màu: ' + TXT_(f.mau), 'Nhu cầu: ' + nhuCau, 'Ngày mong muốn: ' + ngay].join('\n'));
  } catch (e) { console.warn(e); } // lỗi gửi mail không làm mất đăng ký của khách
  return { ok: true };
}
