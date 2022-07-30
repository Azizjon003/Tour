async function update(name, email) {
  let ress = await axios({
    method: "PATCH",
    url: "http://localhost:8080/api/v1/users/updateme",
    data: {
      name,
      email,
    },
  });

  console.log(ress);
  if (ress.status === 200) {
    alert("o'zgartirishlar saqlandi");
    window.setTimeout(() => {
      window.location.assign("/account");
    }, 100);
  }
}

document
  .querySelector(".btn_save")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const name = document.querySelector(".name_input").value;
    const email = document.querySelector(".email_input").value;
    await update(name, email);
  });

async function passwordChange(currentPassword, password, newPassword) {
  const res = await axios({
    method: "PATCH",
    url: "http://localhost:8080/api/v1/users/updatepassword",
    data: {
      currentPassword: currentPassword,
      password: password,
      passwordConfirm: newPassword,
    },
  });
  if (res.status == 200) {
    alert("password yangilandi tizimga qaytadan kiring");
    window.setTimeout(() => {
      window.location.assign("/login");
    }, 100);
  }
}
document
  .querySelector(".btn_password")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    console.log("ahna");
    const currentPassword = document.querySelector("#password-current").value;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#password-confirm").value;
    await passwordChange(currentPassword, password, passwordConfirm);
  });
