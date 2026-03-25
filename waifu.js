(function () {
  window.initWidget = async function (config) {

    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.right = "0";
    canvas.style.bottom = "0";
    canvas.style.zIndex = "9999";
    canvas.style.cursor = "grab"; // 鼠标显示可拖
    document.body.appendChild(canvas);

    try {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: window,
        transparent: true
      });

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);
      app.stage.addChild(model);

      // ---------- 默认右下角位置 ----------
      model.x = window.innerWidth - 200;
      model.y = window.innerHeight - 50;

      // ---------- 自动缩放 ----------
      function resizeModel() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const modelWidth = model.width || 1000;
        const modelHeight = model.height || 1000;

        // 自适应缩放比例
        const scale = Math.min(screenWidth / modelWidth, screenHeight / modelHeight) * 0.25;
        model.scale.set(scale);

        // 默认右下角位置（如果没有拖动）
        if (!dragging) {
          model.x = screenWidth - model.width - 20;
          model.y = screenHeight - model.height - 20;
        }
      }

      // 初始缩放
      let dragging = false; // 标记是否拖动中
      resizeModel();

      // 窗口变化时自动缩放
      window.addEventListener("resize", resizeModel);

      // ---------- 鼠标拖拽 ----------
      let offsetX = 0;
      let offsetY = 0;

      model.interactive = true;
      model.on('pointerdown', (e) => {
        dragging = true;
        model.cursor = 'grabbing';
        const pos = e.data.global;
        offsetX = pos.x - model.x;
        offsetY = pos.y - model.y;
      });

      model.on('pointermove', (e) => {
        if (dragging) {
          const pos = e.data.global;
          model.x = pos.x - offsetX;
          model.y = pos.y - offsetY;
        }
      });

      model.on('pointerup', () => {
        dragging = false;
        model.cursor = 'grab';
      });
      model.on('pointerupoutside', () => {
        dragging = false;
        model.cursor = 'grab';
      });

      console.log("✅ Live2D 加载成功（可拖拽 + 自适应）");
    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
