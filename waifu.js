(function () {
  window.initWidget = async function (config) {

    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.right = "0";
    canvas.style.bottom = "0";
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
      // 在这里改 scaleFactor 来调整模型大小
      let scaleFactor = config.scale || 0.25; // 默认 0.25
      function resizeModel() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const modelWidth = model.width || 100;
        const modelHeight = model.height || 100;

        // scale = 用户自定义比例 * 屏幕适配
        const scale = Math.min(screenWidth / modelWidth, screenHeight / modelHeight) * scaleFactor;
        model.scale.set(scale);

        // 固定右下角
        model.x = screenWidth - model.width * scale - 20;
        model.y = screenHeight - model.height * scale - 20;
      }

      // 初始化
      resizeModel();
      window.addEventListener("resize", resizeModel);

      console.log("✅ Live2D 加载成功（可自定义大小）");

    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
