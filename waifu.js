(function () {
  window.initWidget = async function (config) {

    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.right = "0";
    canvas.style.bottom = "0";
    canvas.style.zIndex = "9999";
    canvas.style.cursor = "grab";
    document.body.appendChild(canvas);

    try {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: window,
        transparent: true
      });

      // 创建容器承载模型
      const container = new PIXI.Container();
      app.stage.addChild(container);

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);
      container.addChild(model);

      // ---------- 拖拽逻辑 ----------
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      container.interactive = true;
      container.cursor = 'grab';

      container.on('pointerdown', (e) => {
        dragging = true;
        container.cursor = 'grabbing';
        const pos = e.data.global;
        offsetX = pos.x - container.x;
        offsetY = pos.y - container.y;
      });

      container.on('pointermove', (e) => {
        if (dragging) {
          const pos = e.data.global;
          container.x = pos.x - offsetX;
          container.y = pos.y - offsetY;
        }
      });

      container.on('pointerup', () => { dragging = false; container.cursor = 'grab'; });
      container.on('pointerupoutside', () => { dragging = false; container.cursor = 'grab'; });

      // ---------- 缩放与位置自适应 ----------
      function resizeContainer() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const modelWidth = model.width || 1000;
        const modelHeight = model.height || 1000;

        // scale 以窗口大小和模型原始尺寸比例自适应
        const scale = Math.min(screenWidth / modelWidth, screenHeight / modelHeight) * 0.25;
        container.scale.set(scale);

        // 如果没拖动过，贴右下角
        if (!dragging) {
          container.x = screenWidth - model.width * scale - 20;
          container.y = screenHeight - model.height * scale - 20;
        }
      }

      resizeContainer();
      window.addEventListener("resize", resizeContainer);

      console.log("✅ Live2D 加载成功（可拖拽 + 自适应 + 贴边右下）");

    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
