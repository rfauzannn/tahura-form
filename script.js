const SUPABASE_URL = "https://urjwbfsadgntgsbphoxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyandiZnNhZGdudGdzYnBob3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNjI5MzgsImV4cCI6MjA2MjkzODkzOH0.Un-yoL8ZKF41JFMIkAZ49g4aGX8D15HA59Oj-TVYXnE";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("tahuraForm");
const alertBox = document.getElementById("alert");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const nama = formData.get("nama_lengkap");
  const kelompok = formData.get("kelompok_sambung");
  const noTelp = formData.get("no_telp");
  const punyaKendaraan = formData.get("punya_kendaraan") === "true";
  const beraniBawa = formData.get("berani_bawa_jalan") === "true" ? true : false;
  const gender = formData.get("gender");
  const opsiPembayaran = formData.get("opsi_pembayaran");
  const buktiTransferFile = formData.get("bukti_transfer");

  alertBox.innerHTML = "";
  
  let buktiUrl = null;

  if (opsiPembayaran === "tf") {
    if (!buktiTransferFile || buktiTransferFile.size === 0) {
      alertBox.innerHTML = `<div class="alert alert-danger">Mohon upload bukti transfer!</div>`;
      return;
    }
    
    const fileName = `${Date.now()}_${buktiTransferFile.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from("bukti-transfer")
      .upload(fileName, buktiTransferFile);

    if (uploadError) {
      alertBox.innerHTML = `<div class="alert alert-danger">Gagal upload bukti transfer.</div>`;
      console.error(uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("bukti-transfer")
      .getPublicUrl(fileName);

    buktiUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase
    .from("Pendaftaran")
    .insert([{
      nama_lengkap: nama,
      kelompok_sambung: kelompok,
      no_telp: noTelp,
      punya_kendaraan: punyaKendaraan,
      berani_bawa: punyaKendaraan ? beraniBawa : null,
      gender: gender,
      opsi_pembayaran: opsiPembayaran,
      bukti_transfer: buktiUrl,
    }]);

  if (error) {
    alertBox.innerHTML = `<div class="alert alert-danger">Gagal menyimpan data: ${error.message}</div>`;
    console.error(error);
  } else {
    alertBox.innerHTML = `<div class="alert alert-success">Pendaftaran berhasil!</div>`;
    form.reset();
    document.getElementById('beraniBawaContainer').style.display = "none";
    document.getElementById('uploadContainer').style.display = "none";
  }
});
