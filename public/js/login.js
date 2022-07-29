async function enterSystem(email, password) {
  try {
    console.log("salom ");
    const ress = await axios({
      method: "POST",
      url: "http://localhost:8080/api/v1/users/signin",
      data: {
        email,
        password,
      },
    });
    if (ress.status === 200) {
      alert("siz tizimga muvafaqiyatli kirdingiz");
      window.setTimeout(() => {
        location.assign("/");
      }, 100);
    }
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}
document.querySelector(".btn").addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("sasasas");
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  await enterSystem(email, password);
});
