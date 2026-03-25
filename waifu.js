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
        autoStart: true,
        resizeTo: window,
        transparent: true
      });

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);

      model.scale.set(0.3);
      model.x = window.innerWidth - 200;
      model.y = window.innerHeight - 300;

      app.stage.addChild(model);

      console.log("✅ Live2D 加载成功");
    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
