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

      // ---------- 自动缩放函数 ----------
      function resizeModel() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // 模型原始宽高（PIXI 会先加载完模型才能拿到）
        const modelWidth = model.width || 1000;
        const modelHeight = model.height || 1000;

        // 计算缩放比例，保证完整显示
        const scale = Math.min(screenWidth / modelWidth, screenHeight / modelHeight) * 0.25;

        model.scale.set(scale);

        // 固定右下角，留一点边距
        model.x = screenWidth - model.width - 20;
        model.y = screenHeight - model.height - 20;
      }

      // 初始执行一次
      resizeModel();

      // 窗口大小变化时自动调整
      window.addEventListener("resize", resizeModel);

      console.log("✅ Live2D 加载成功");
    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
