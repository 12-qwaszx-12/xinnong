(function () {
  window.initWidget = async function (config) {
    // 创建 canvas
    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";  // 位置由 footer 控制
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    try {
      // 初始化 PIXI
      const app = new PIXI.Application({
        view: canvas,
        transparent: true
      });

      // 创建容器并加载模型
      const container = new PIXI.Container();
      app.stage.addChild(container);

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);
      container.addChild(model);

      console.log("✅ Live2D 加载成功");

    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
