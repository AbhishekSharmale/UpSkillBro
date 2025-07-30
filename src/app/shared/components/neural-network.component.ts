import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-neural-network',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas class="neural-canvas"></canvas>`,
  styles: [`
    .neural-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  `]
})
export class NeuralNetworkComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private connections: Connection[] = [];
  private animationId!: number;

  ngOnInit() {
    this.initCanvas();
    this.createNetwork();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    const canvas = this.canvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private createNetwork() {
    const layers = [6, 8, 6, 4];
    const layerSpacing = this.canvas.nativeElement.width / (layers.length + 1);
    
    layers.forEach((nodeCount, layerIndex) => {
      const nodeSpacing = this.canvas.nativeElement.height / (nodeCount + 1);
      
      for (let i = 0; i < nodeCount; i++) {
        this.nodes.push(new Node(
          layerSpacing * (layerIndex + 1),
          nodeSpacing * (i + 1),
          layerIndex
        ));
      }
    });

    // Create connections
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes.length; j++) {
        if (this.nodes[j].layer === this.nodes[i].layer + 1) {
          this.connections.push(new Connection(this.nodes[i], this.nodes[j]));
        }
      }
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    
    // Draw connections
    this.connections.forEach(connection => {
      connection.update();
      connection.draw(this.ctx);
    });
    
    // Draw nodes
    this.nodes.forEach(node => {
      node.update();
      node.draw(this.ctx);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

class Node {
  x: number;
  y: number;
  layer: number;
  activation: number = 0;
  targetActivation: number = 0;
  pulseTime: number = 0;

  constructor(x: number, y: number, layer: number) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.targetActivation = Math.random();
  }

  update() {
    this.activation += (this.targetActivation - this.activation) * 0.02;
    this.pulseTime += 0.1;
    
    if (Math.random() < 0.005) {
      this.targetActivation = Math.random();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const pulse = Math.sin(this.pulseTime) * 0.3 + 0.7;
    const radius = 4 + this.activation * 6;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 56, 255, ${this.activation * pulse})`;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(79, 142, 255, ${this.activation * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class Connection {
  from: Node;
  to: Node;
  weight: number;
  signal: number = 0;
  signalSpeed: number = 0.02;

  constructor(from: Node, to: Node) {
    this.from = from;
    this.to = to;
    this.weight = Math.random() * 2 - 1;
  }

  update() {
    if (this.from.activation > 0.7 && Math.random() < 0.1) {
      this.signal = 1;
    }
    
    if (this.signal > 0) {
      this.signal -= this.signalSpeed;
      if (this.signal <= 0) {
        this.to.targetActivation = Math.min(1, this.to.targetActivation + 0.3);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const opacity = Math.abs(this.weight) * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.strokeStyle = `rgba(0, 56, 255, ${opacity})`;
    ctx.lineWidth = Math.abs(this.weight);
    ctx.stroke();
    
    if (this.signal > 0) {
      const progress = 1 - this.signal;
      const x = this.from.x + (this.to.x - this.from.x) * progress;
      const y = this.from.y + (this.to.y - this.from.y) * progress;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }
  }
}