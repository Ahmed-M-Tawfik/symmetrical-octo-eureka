export class SpriteAnimator {
  update(deltaTime, gameEntity) {
    let s = gameEntity.spriteData;
    s.frameTimer += deltaTime;
    if (s.frameTimer > s.frameInterval) {
      s.frameTimer = 0;
      s.frameX++;
      if (s.frameX > s.maxFrame) s.frameX = 0;
    }
  }
  draw(context, gameEntity, isDebug = false) {
    if (isDebug) {
      context.strokeRect(gameEntity.x, gameEntity.y, gameEntity.width, gameEntity.height);
    }
    context.drawImage(
      gameEntity.spriteData.image,
      gameEntity.spriteData.frameX * gameEntity.spriteData.spriteWidth,
      gameEntity.spriteData.frameY * gameEntity.spriteData.spriteHeight,
      gameEntity.spriteData.spriteWidth,
      gameEntity.spriteData.spriteHeight,
      gameEntity.x,
      gameEntity.y,
      gameEntity.width,
      gameEntity.height
    );
    if (gameEntity.draw) gameEntity.draw(context);
  }
}
