"use client";

import { useEffect, useRef } from "react";

interface PixiComponentProps {
  demoType: string;
}

// 定义形状类型
interface CircleShape {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface SquareOrTriangleShape {
  type: "square" | "triangle";
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

type Shape = CircleShape | SquareOrTriangleShape;

// 粒子类型定义
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  type: "circle" | "square" | "triangle";
  scale: number;
  alpha: number;
  originalSize: number;
}

export default function PixiComponent({ demoType }: PixiComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // 初始化基础动画
  const initBasicDemo = () => {
    if (!containerRef.current) return;

    // 取消现有动画
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    // 清除现有内容
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    try {
      // 创建新的 canvas 元素
      const canvas = document.createElement("canvas");
      canvas.width = containerRef.current.clientWidth;
      canvas.height = 600;
      containerRef.current.appendChild(canvas);
      canvasRef.current = canvas;

      // 获取 2D 绘图上下文
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("无法获取 Canvas 2D 上下文");
        return;
      }

      // 定义形状
      const shapes: Shape[] = [
        {
          type: "circle",
          x: canvas.width / 2,
          y: canvas.height / 2,
          radius: 60,
          color: "#ff3e3e",
          rotation: 0,
          rotationSpeed: 0.01,
        },
        {
          type: "square",
          x: canvas.width / 2 - 150,
          y: canvas.height / 2,
          size: 80,
          color: "#3e9fff",
          rotation: 0,
          rotationSpeed: -0.02,
        },
        {
          type: "triangle",
          x: canvas.width / 2 + 150,
          y: canvas.height / 2,
          size: 100,
          color: "#3eff9f",
          rotation: 0,
          rotationSpeed: 0.03,
        },
      ];

      // 动画变量
      let time = 0;

      // 绘制圆形
      const drawCircle = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        color: string,
        rotation: number
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      };

      // 绘制方形
      const drawSquare = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string,
        rotation: number
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.rect(-size / 2, -size / 2, size, size);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      };

      // 绘制三角形
      const drawTriangle = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string,
        rotation: number
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      };

      // 动画循环
      const animate = () => {
        // 安全检查
        if (!canvas || !ctx) {
          return;
        }

        // 清除画布
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 更新时间
        time += 0.01;

        // 更新和绘制每个形状
        shapes.forEach(shape => {
          // 更新旋转
          shape.rotation += shape.rotationSpeed;

          // 更新圆的颜色
          if (shape.type === "circle") {
            const r = Math.sin(time) * 0.5 + 0.5;
            const g = Math.sin(time + 2) * 0.5 + 0.5;
            const b = Math.sin(time + 4) * 0.5 + 0.5;
            shape.color = `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`;
          }

          // 绘制形状
          if (shape.type === "circle") {
            drawCircle(
              ctx,
              shape.x,
              shape.y,
              shape.radius,
              shape.color,
              shape.rotation
            );
          } else if (shape.type === "square" || shape.type === "triangle") {
            if (shape.type === "square") {
              drawSquare(
                ctx,
                shape.x,
                shape.y,
                shape.size,
                shape.color,
                shape.rotation
              );
            } else {
              drawTriangle(
                ctx,
                shape.x,
                shape.y,
                shape.size,
                shape.color,
                shape.rotation
              );
            }
          }
        });

        // 请求下一帧
        animationFrameIdRef.current = requestAnimationFrame(animate);
      };

      // 开始动画循环
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error("Canvas 初始化错误:", error);
    }
  };

  // 初始化交互式动画
  const initInteractiveDemo = () => {
    if (!containerRef.current) return;

    // 取消现有动画
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    // 清除现有内容
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    try {
      // 创建新的 canvas 元素
      const canvas = document.createElement("canvas");
      canvas.width = containerRef.current.clientWidth;
      canvas.height = 600;
      containerRef.current.appendChild(canvas);
      canvasRef.current = canvas;

      // 获取 2D 绘图上下文
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("无法获取 Canvas 2D 上下文");
        return;
      }

      // 创建粒子
      const particles: Particle[] = [];

      // 创建25个随机粒子
      for (let i = 0; i < 25; i++) {
        const size = 20 + Math.random() * 30;
        const type = ["circle", "square", "triangle"][
          Math.floor(Math.random() * 3)
        ] as "circle" | "square" | "triangle";
        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          originalSize: size,
          color: color,
          type: type,
          scale: 1,
          alpha: 1,
        });
      }

      // 鼠标位置
      let mouseX = -1000;
      let mouseY = -1000;

      // 鼠标事件
      canvas.addEventListener("mousemove", e => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });

      canvas.addEventListener("mouseleave", () => {
        mouseX = -1000;
        mouseY = -1000;
      });

      canvas.addEventListener("mousedown", e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 检查是否点击了粒子
        particles.forEach(p => {
          const dx = p.x - x;
          const dy = p.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < p.size / 2) {
            p.scale = 1.2;
            p.alpha = 0.5;
          }
        });
      });

      canvas.addEventListener("mouseup", () => {
        particles.forEach(p => {
          p.scale = 1;
          p.alpha = 1;
        });
      });

      // 绘制粒子
      const drawParticle = (
        ctx: CanvasRenderingContext2D,
        particle: Particle
      ) => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.translate(particle.x, particle.y);
        ctx.scale(particle.scale, particle.scale);

        const size = particle.size;
        ctx.fillStyle = particle.color;

        if (particle.type === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === "square") {
          ctx.beginPath();
          ctx.rect(-size / 2, -size / 2, size, size);
          ctx.fill();
        } else if (particle.type === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      };

      // 动画循环
      const animate = () => {
        // 安全检查
        if (!canvas || !ctx) {
          return;
        }

        // 清除画布
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 更新和绘制粒子
        particles.forEach(particle => {
          // 如果鼠标接近，则粒子逃离
          if (mouseX > 0 && mouseY > 0) {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const angle = Math.atan2(dy, dx);
              const force = (100 - distance) / 10;

              particle.x += Math.cos(angle) * force;
              particle.y += Math.sin(angle) * force;

              // 确保粒子不会超出屏幕
              if (particle.x < particle.size / 2)
                particle.x = particle.size / 2;
              if (particle.x > canvas.width - particle.size / 2)
                particle.x = canvas.width - particle.size / 2;
              if (particle.y < particle.size / 2)
                particle.y = particle.size / 2;
              if (particle.y > canvas.height - particle.size / 2)
                particle.y = canvas.height - particle.size / 2;
            }
          }

          // 绘制粒子
          drawParticle(ctx, particle);
        });

        // 请求下一帧
        animationFrameIdRef.current = requestAnimationFrame(animate);
      };

      // 开始动画循环
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error("Canvas 初始化错误:", error);
    }
  };

  // 当组件挂载或demoType改变时初始化动画
  useEffect(() => {
    if (demoType === "basic") {
      initBasicDemo();
    } else {
      initInteractiveDemo();
    }

    // 组件卸载时清理
    return () => {
      // 取消动画
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }

      // 在清理函数中捕获当前容器引用
      const currentContainer = containerRef.current;

      // 清空容器
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
      canvasRef.current = null;
    };
  }, [demoType]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      try {
        // 重新初始化当前演示以适应新的容器大小
        if (demoType === "basic") {
          initBasicDemo();
        } else {
          initInteractiveDemo();
        }
      } catch (error) {
        console.error("调整大小错误:", error);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [demoType]);

  return (
    <div
      ref={containerRef}
      className="border rounded-lg overflow-hidden w-full h-[600px]"
    />
  );
}
