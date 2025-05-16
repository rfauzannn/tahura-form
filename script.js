const SUPABASE_URL = "https://urjwbfsadgntgsbphoxj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyandiZnNhZGdudGdzYnBob3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNjI5MzgsImV4cCI6MjA2MjkzODkzOH0.Un-yoL8ZKF41JFMIkAZ49g4aGX8D15HA59Oj-TVYXnE";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("formPendaftaran").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("namaLengkap").value;
  const kelompok = document.getElementById("kelompokSambung").value;
  const noTelp = document.getElementById("noTelp").value;
  const punyaKendaraan = document.querySelector('input[name="punyaKendaraan"]:checked').value === "ya";
  const beraniBawa = document.querySelector('input[name="beraniBawa"]:checked')?.value === "ya" || null;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const opsiPembayaran = document.querySelector('input[name="opsiPembayaran"]:checked').value;
  const fileInput = document.getElementById("buktiTransfer");

  let buktiUrl = null;

  if (opsiPembayaran === "tf" && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabaseClient.storage
      .from("bukti-transfer")
      .upload(fileName, file);

    if (error) {
      alert("Gagal upload bukti transfer.");
      console.error(error);
      return;
    }

    const { data: publicUrlData } = supabaseClient
      .storage
      .from("bukti-transfer")
      .getPublicUrl(fileName);

    buktiUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabaseClient.from("Pendaftaran").insert([{
    nama_lengkap: nama,
    kelompok_sambung: kelompok,
    no_telp: noTelp,
    punya_kendaraan: punyaKendaraan,
    berani_bawa: beraniBawa,
    gender: gender,
    opsi_pembayaran: opsiPembayaran,
    bukti_transfer: buktiUrl,
  }]);

  if (error) {
    alert("Gagal menyimpan data.");
    console.error(error);
  } else {
    alert("Pendaftaran berhasil!");
    document.getElementById("formPendaftaran").reset();
    document.getElementById("opsiTf").classList.add("d-none");
    document.getElementById("opsiBawa").classList.add("d-none");
  }
});
