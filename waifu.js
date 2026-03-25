(function () {
  window.initWidget = async function (config) {

    const canvas = document.createElement("canvas");
    canvas.id = "live2d";
    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.zIndex = "9999";
    canvas.style.cursor = "grab";
    document.body.appendChild(canvas);

    try {
      const app = new PIXI.Application({
        view: canvas,
        resizeTo: window,
        transparent: true
      });

      const container = new PIXI.Container();
      app.stage.addChild(container);

      const model = await PIXI.live2d.Live2DModel.from(config.waifuPath);
      container.addChild(model);

      // 设置 pivot 为模型中心
      container.pivot.set(model.width / 2, model.height / 2);

      // ---------- 设置 hitArea ----------
      container.hitArea = new PIXI.Rectangle(0, 0, model.width, model.height);

      // ---------- 拖拽 ----------
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      container.interactive = true;
      container.cursor = 'grab';

      container.on('pointerdown', (e) => {
        dragging = true;
        container.cursor = 'grabbing';
        const pos = e.data.getLocalPosition(container.parent);
        offsetX = pos.x - container.x;
        offsetY = pos.y - container.y;
      });

      container.on('pointermove', (e) => {
        if (dragging) {
          const pos = e.data.getLocalPosition(container.parent);
          container.x = pos.x - offsetX;
          container.y = pos.y - offsetY;
        }
      });

      container.on('pointerup', () => { dragging = false; container.cursor = 'grab'; });
      container.on('pointerupoutside', () => { dragging = false; container.cursor = 'grab'; });


      console.log("✅ Live2D 可拖拽加载成功");

    } catch (e) {
      console.error("❌ Live2D 加载失败:", e);
    }
  };
})();
