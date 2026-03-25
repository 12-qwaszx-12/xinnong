(function () {
  window.initWidget = async function (config) {

    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)"; // 初始居中
    canvas.style.zIndex = "9999";
    canvas.style.cursor = "grab";
    document.body.appendChild(canvas);

    try {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: window,
        transparent: true
      });

      // 创建容器承载模型，方便拖拽
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

      // ---------- 缩放与居中 ----------
      let scaleFactor = config.scale || 0.25; // 可自定义大小
      function resizeContainer() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const modelWidth = model.width || 1000;
        const modelHeight = model.height || 1000;

        const scale = Math.min(screenWidth / modelWidth, screenHeight / modelHeight) * scaleFactor;
        container.scale.set(scale);

        // 如果没拖动过，居中显示
        if (!dragging) {
          container.x = screenWidth / 2;
          container.y = screenHeight / 2;
        }
      }

      resizeContainer();
      window.addEventListener("resize", resizeContainer);

      console.log("✅ Live2D 居中加载成功（可拖拽 + 自适应大小）");

    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
