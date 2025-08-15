"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'person' | 'company' | 'technology' | 'concept';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string;
  target: string;
  type: 'works_at' | 'develops' | 'uses' | 'related_to';
  strength: number;
}

interface KnowledgeGraphProps {
  width?: number;
  height?: number;
}

const sampleNodes: Node[] = [
  { id: '1', name: '张三', type: 'person' },
  { id: '2', name: '李四', type: 'person' },
  { id: '3', name: '科技公司A', type: 'company' },
  { id: '4', name: '科技公司B', type: 'company' },
  { id: '5', name: '人工智能', type: 'technology' },
  { id: '6', name: '机器学习', type: 'technology' },
  { id: '7', name: '深度学习', type: 'technology' },
  { id: '8', name: '数据科学', type: 'concept' },
  { id: '9', name: '云计算', type: 'technology' },
  { id: '10', name: '大数据', type: 'concept' },
];

const sampleLinks: Link[] = [
  { source: '1', target: '3', type: 'works_at', strength: 1 },
  { source: '2', target: '4', type: 'works_at', strength: 1 },
  { source: '3', target: '5', type: 'develops', strength: 0.8 },
  { source: '4', target: '6', type: 'develops', strength: 0.7 },
  { source: '5', target: '6', type: 'related_to', strength: 0.9 },
  { source: '6', target: '7', type: 'related_to', strength: 0.95 },
  { source: '5', target: '8', type: 'uses', strength: 0.6 },
  { source: '6', target: '8', type: 'uses', strength: 0.8 },
  { source: '3', target: '9', type: 'uses', strength: 0.7 },
  { source: '4', target: '10', type: 'uses', strength: 0.6 },
  { source: '8', target: '10', type: 'related_to', strength: 0.8 },
  { source: '9', target: '10', type: 'related_to', strength: 0.7 },
];

const nodeColors = {
  person: '#3b82f6',
  company: '#10b981',
  technology: '#f59e0b',
  concept: '#8b5cf6',
};

const linkColors = {
  works_at: '#6b7280',
  develops: '#059669',
  uses: '#dc2626',
  related_to: '#7c3aed',
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  width = 800, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(sampleNodes)
      .force('link', d3.forceLink(sampleLinks).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const container = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    const links = container.append('g')
      .selectAll('line')
      .data(sampleLinks)
      .enter().append('line')
      .attr('stroke', (d) => linkColors[d.type])
      .attr('stroke-width', (d) => Math.sqrt(d.strength) * 3)
      .attr('stroke-opacity', 0.6);

    const linkLabels = container.append('g')
      .selectAll('text')
      .data(sampleLinks)
      .enter().append('text')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text((d) => {
        const typeMap = {
          works_at: '任职于',
          develops: '开发',
          uses: '使用',
          related_to: '相关'
        };
        return typeMap[d.type];
      });

    const nodeGroups = container.append('g')
      .selectAll('g')
      .data(sampleNodes)
      .enter().append('g')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    const circles = nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', (d) => nodeColors[d.type])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    const labels = nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .text((d) => d.name.length > 6 ? d.name.substring(0, 6) + '...' : d.name);

    nodeGroups
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .on('mouseover', (event, d) => {
        setHoveredNode(d);
        circles
          .attr('r', (node) => node === d ? 25 : 20)
          .attr('stroke-width', (node) => node === d ? 4 : 2);
      })
      .on('mouseout', (event, d) => {
        setHoveredNode(null);
        circles
          .attr('r', 20)
          .attr('stroke-width', 2);
      });

    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      nodeGroups
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [width, height]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">知识图谱示例</h2>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm">人物</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">公司</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">技术</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm">概念</span>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="w-full h-auto bg-gray-50"
            />
          </div>

          {selectedNode && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">节点信息</h3>
              <p><strong>名称:</strong> {selectedNode.name}</p>
              <p><strong>类型:</strong> {
                selectedNode.type === 'person' ? '人物' :
                selectedNode.type === 'company' ? '公司' :
                selectedNode.type === 'technology' ? '技术' : '概念'
              }</p>
              <p><strong>连接数:</strong> {
                sampleLinks.filter(link => 
                  link.source === selectedNode.id || link.target === selectedNode.id
                ).length
              }</p>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <p>• 点击节点查看详细信息</p>
            <p>• 拖拽节点重新排列布局</p>
            <p>• 使用鼠标滚轮缩放图表</p>
          </div>
        </div>
      </div>
    </div>
  );
};
