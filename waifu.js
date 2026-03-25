(function () {
  window.initWidget = async function (config) {

    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.left = "50%";    // 水平居中
    canvas.style.top = "50%";     // 垂直居中
    canvas.style.transform = "translate(-50%, -50%)"; // 真正居中
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    try {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: window,
        transparent: true
      });

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);
      app.stage.addChild(model);

      // ---------- 自定义大小 ----------
      let scaleFactor = config.scale || 0.25; // 默认 0.25
      function resizeModel() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const modelWidth = model.width || 1000;
        const modelHeight = model.height || 1000;

        const scale = Math.min(screenWidth / modelWidth, screenHeight / modelHeight) * scaleFactor;
        model.scale.set(scale);

        // 居中显示：因为 canvas 用了 CSS transform，所以不需要调整 x/y
        model.x = model.width * scale / 2;
        model.y = model.height * scale / 2;
      }

      // 初始化
      resizeModel();
      window.addEventListener("resize", resizeModel);

      console.log("✅ Live2D 居中加载成功");

    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
