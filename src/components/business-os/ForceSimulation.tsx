import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { gsap } from 'gsap';
import { GraphData, NodeData, LinkData } from './types';

interface ForceSimulationProps {
  data: GraphData;
  width: number;
  height: number;
  onNodeUpdate: (nodes: NodeData[]) => void;
  onLinkUpdate: (links: LinkData[]) => void;
}

export const ForceSimulation = ({ 
  data, 
  width, 
  height, 
  onNodeUpdate, 
  onLinkUpdate 
}: ForceSimulationProps) => {
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);

  useEffect(() => {
    // Create force simulation with custom link distances
    const simulation = d3.forceSimulation<NodeData>(data.nodes)
      .force('link', d3.forceLink<NodeData, LinkData>(data.links)
        .id((d: NodeData) => d.id)
        .distance((d, i) => {
          // Variable distances based on index for visual variety
          return i % 2 === 0 ? 180 : 120;
        })
        .strength(0.6))
      .force('charge', d3.forceManyBody()
        .strength(-400)
        .distanceMax(250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius((d: NodeData) => d.id === 'business-os' ? 55 : 35)
        .strength(0.8));

    // Pin the center node
    const centerNode = data.nodes.find(n => n.id === 'business-os');
    if (centerNode) {
      centerNode.fx = width / 2;
      centerNode.fy = height / 2;
    }

    // GSAP-controlled rotation timeline
    let rotationTimeline: gsap.core.Timeline | null = null;
    let isUserInteracting = false;
    
    // Track user interactions
    const handleInteractionStart = () => { 
      isUserInteracting = true;
      if (rotationTimeline) {
        rotationTimeline.pause();
      }
    };
    
    const handleInteractionEnd = () => { 
      setTimeout(() => { 
        isUserInteracting = false;
        if (rotationTimeline && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          rotationTimeline.resume();
        }
      }, 500);
    };

    // Add interaction listeners
    const graphElement = document.getElementById('business-os-graph');
    if (graphElement) {
      graphElement.addEventListener('mouseenter', handleInteractionStart);
      graphElement.addEventListener('mouseleave', handleInteractionEnd);
      graphElement.addEventListener('click', handleInteractionStart);
    }

    // Create GSAP rotation timeline
    const createRotationTimeline = () => {
      const svgGroup = document.querySelector('#business-os-graph svg g');
      const centerLabel = document.querySelector('#center-label-glow');
      
      if (svgGroup && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        rotationTimeline = gsap.timeline({ repeat: -1 });
        
        rotationTimeline
          .to(svgGroup, {
            rotation: "+=30",
            duration: 0.5,
            ease: "power2.out",
            transformOrigin: "center center"
          })
          .to(centerLabel, {
            opacity: 1,
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out"
          }, "<")
          .to(centerLabel, {
            opacity: 0.7,
            scale: 1,
            duration: 0.2,
            ease: "power2.in"
          }, ">-0.2")
          .to({}, { duration: 4.3 }); // Hold for 4.3s (total 4.5s pause)
      }
    };

    // Initialize rotation after a short delay to ensure DOM is ready
    setTimeout(createRotationTimeline, 100);

    // Update positions on tick
    simulation.on('tick', () => {
      onNodeUpdate([...data.nodes]);
      onLinkUpdate([...data.links]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      if (rotationTimeline) {
        rotationTimeline.kill();
      }
      if (graphElement) {
        graphElement.removeEventListener('mouseenter', handleInteractionStart);
        graphElement.removeEventListener('mouseleave', handleInteractionEnd);
        graphElement.removeEventListener('click', handleInteractionStart);
      }
    };
  }, [data, width, height, onNodeUpdate, onLinkUpdate]);

  // Reheat simulation when component becomes visible
  const reheatSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
    }
  };

  // Expose reheat function for scroll triggers
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reheatSimulation();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5
    });

    const element = document.getElementById('business-os-graph');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component only manages the simulation
};