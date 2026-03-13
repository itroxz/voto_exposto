import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  yes: number;
  no: number;
  absent: number;
  obstruction?: number;
  size?: number;
}

export default function DonutChart({
  yes,
  no,
  absent,
  obstruction = 0,
  size = 160,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const data = [
      { label: 'Sim', value: yes, color: 'var(--vote-yes)' },
      { label: 'Não', value: no, color: 'var(--vote-no)' },
      { label: 'Ausente', value: absent, color: 'var(--vote-absent)' },
    ];
    if (obstruction > 0) {
      data.push({ label: 'Obstrução', value: obstruction, color: 'var(--vote-obstruction)' });
    }

    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return;

    const radius = size / 2;
    const innerRadius = radius * 0.6;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${radius}, ${radius})`);

    const pie = d3
      .pie<(typeof data)[0]>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3
      .arc<d3.PieArcDatum<(typeof data)[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 2)
      .cornerRadius(3);

    const arcs = g
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .style('transition', 'opacity 0.2s')
      .on('mouseenter', function () {
        d3.select(this).style('opacity', '0.8');
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', '1');
      });

    // Center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.1em')
      .style('font-family', 'var(--font-body)')
      .style('font-weight', '800')
      .style('font-size', `${size * 0.14}px`)
      .style('fill', 'var(--text-primary)')
      .text(total.toString());

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.4em')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', `${size * 0.065}px`)
      .style('fill', 'var(--text-secondary)')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em')
      .text('votos');

  }, [yes, no, absent, obstruction, size]);

  return <svg ref={svgRef} />;
}
