document.querySelector(".logout").addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    console.log("sdfsfsdfds");
    const ress = await axios({
      method: "POST",
      url: "http://localhost:8080/logout",
      data: {
        email: "dhjba",
      },
    });
    console.log(ress);
    window.setTimeout(() => {
      alert("siz tizimdan chiqdingiz");
      window.location.assign("/login");
    }, 1000);
  } catch (err) {
    console.log(err);
    // alert("afsjkafs jlds");
  }
});
