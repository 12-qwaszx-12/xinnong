(function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  function loadStyle(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  window.initWidget = async function (config) {
    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.right = "0";
    canvas.style.bottom = "0";
    canvas.style.zIndex = "9999";
    canvas.width = 300;
    canvas.height = 600;
    document.body.appendChild(canvas);

    try {
      // 加载核心
      await loadScript("https://fastly.jsdelivr.net/gh/letere-gzj/live2d-widget-v3@main/Core/live2dcubismcore.js");
      await loadScript("https://fastly.jsdelivr.net/gh/letere-gzj/live2d-widget-v3@main/live2d-sdk.js");

      // 初始化
      const app = new PIXI.Application({
        view: canvas,
        autoStart: true,
        resizeTo: window,
        transparent: true
      });

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);

      model.scale.set(0.3);
      model.x = window.innerWidth - 150;
      model.y = window.innerHeight - 300;

      app.stage.addChild(model);

      console.log("✅ Live2D 加载成功");
    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
