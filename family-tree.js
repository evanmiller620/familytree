// const width = window.innerWidth;
// const height = window.innerHeight;
// const nodeWidth = 140;
// const nodeHeight = 70;
// const marriageGap = 20;

// const svg = d3.select("#family-tree")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

// const g = svg.append("g");

// const zoom = d3.zoom()
//     .scaleExtent([0.1, 3])
//     .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//     });

// svg.call(zoom);

// function createTreeData(data) {
//     const idMap = new Map(data.map(d => [d.id, { ...d, children: [] }]));
//     const root = { id: 0, children: [] };

//     for (const node of idMap.values()) {
//         if (node.level !== null) {
//             if (node.level === 1) {
//                 root.children.push(node);
//             } else {
//                 const levelParent = root.children.find(c => c.level === node.level - 1);
//                 if (levelParent) {
//                     levelParent.children.push(node);
//                 } else {
//                     root.children.push(node);
//                 }
//             }
//         }
//     }

//     for (const node of idMap.values()) {
//         if (node.fatherId !== null && node.motherId !== null) {
//             const father = idMap.get(node.fatherId);
//             const mother = idMap.get(node.motherId);
//             if (father && mother) {
//                 if (!father.children.some(child => child.id === node.id)) {
//                     father.children.push(node);
//                 }
//             }
//         }
//     }

//     return root;
// }

// const treeData = createTreeData(familyData);

// const treeLayout = d3.tree().nodeSize([nodeWidth * 2.5, nodeHeight * 4]);
// const root = d3.hierarchy(treeData);
// treeLayout(root);

// function adjustNodePositions(root) {
//     const minDistance = nodeWidth * 1.2;
    
//     root.each(node => {
//         if (node.children) {
//             const children = node.children;
//             const midPoint = (children[0].x + children[children.length - 1].x) / 2;
//             node.x = midPoint;

//             for (let i = 0; i < children.length - 1; i++) {
//                 const currentChild = children[i];
//                 const nextChild = children[i + 1];
//                 const distance = nextChild.x - currentChild.x;

//                 if (distance < minDistance) {
//                     const adjustment = (minDistance - distance) / 2;
//                     currentChild.x -= adjustment;
//                     nextChild.x += adjustment;
//                 }
//             }
//         }
//     });
// }

// adjustNodePositions(root);

// function createParentChildLinks(node) {
//     const links = [];
//     if (node.children) {
//         const spouse = familyData.find(d => d.id === node.data.spouseId);
//         const spouseNode = root.descendants().find(d => d.data.id === spouse?.id);
        
//         const startX = spouseNode ? (node.x + spouseNode.x) / 2 : node.x;
//         const startY = node.y + nodeHeight / 2 + marriageGap / 2;
        
//         const childrenMidX = (node.children[0].x + node.children[node.children.length - 1].x) / 2;
//         links.push({
//             source: [startX, startY],
//             target: [childrenMidX, (node.y + node.children[0].y) / 2]
//         });
        
//         node.children.forEach(child => {
//             links.push({
//                 source: [childrenMidX, (node.y + child.y) / 2],
//                 target: [child.x, child.y - nodeHeight / 2]
//             });
//             links.push(...createParentChildLinks(child));
//         });
//     }
//     return links;
// }

// const parentChildLinks = createParentChildLinks(root);

// const marriageLinks = familyData.filter(d => d.spouseId).map(d => {
//     const source = root.descendants().find(node => node.data.id === d.id);
//     const target = root.descendants().find(node => node.data.id === d.spouseId);
//     if (source && target) {
//         const x1 = Math.min(source.x, target.x);
//         const x2 = Math.max(source.x, target.x);
//         return {
//             source: [x1, source.y],
//             target: [x2, target.y]
//         };
//     }
//     return null;
// }).filter(Boolean);

// g.selectAll(".link")
//     .data(parentChildLinks)
//     .enter().append("path")
//     .attr("class", "link")
//     .attr("d", d => `M${d.source[0]},${d.source[1]} L${d.target[0]},${d.target[1]}`)
//     .attr("stroke", "#2c3e50")
//     .attr("stroke-width", 2)
//     .attr("fill", "none");

// g.selectAll(".marriage-link")
//     .data(marriageLinks)
//     .enter().append("line")
//     .attr("class", "marriage-link")
//     .attr("x1", d => d.source[0])
//     .attr("y1", d => d.source[1] + nodeHeight / 2 + marriageGap / 2)
//     .attr("x2", d => d.target[0])
//     .attr("y2", d => d.target[1] + nodeHeight / 2 + marriageGap / 2)
//     .attr("stroke", "#e74c3c")
//     .attr("stroke-width", 2);

// const node = g.selectAll(".node")
//     .data(root.descendants().slice(1))
//     .enter().append("g")
//     .attr("class", "node")
//     .attr("transform", d => {
//         const spouse = familyData.find(s => s.id === d.data.spouseId);
//         const spouseNode = root.descendants().find(n => n.data.id === spouse?.id);
//         if (spouseNode && d.x < spouseNode.x) {
//             return `translate(${d.x - marriageGap / 2},${d.y})`;
//         } else if (spouseNode) {
//             return `translate(${d.x + marriageGap / 2},${d.y})`;
//         }
//         return `translate(${d.x},${d.y})`;
//     });

// node.append("rect")
//     .attr("width", nodeWidth)
//     .attr("height", nodeHeight)
//     .attr("x", -nodeWidth / 2)
//     .attr("y", -nodeHeight / 2)
//     .attr("rx", 10)
//     .attr("ry", 10)
//     .attr("fill", "#ecf0f1")
//     .attr("stroke", "#3498db")
//     .attr("stroke-width", 2);

// node.append("text")
//     .attr("class", "label name")
//     .attr("dy", "0.3em")
//     .attr("text-anchor", "middle")
//     .attr("font-size", "14px")
//     .attr("font-weight", "bold")
//     .text(d => d.data.name);

// node.append("text")
//     .attr("class", "label birth")
//     .attr("dy", "2em")
//     .attr("text-anchor", "middle")
//     .attr("font-size", "12px")
//     .text(d => d.data.birth)
//     .style("opacity", 0);

// node.append("text")
//     .attr("class", "label occupation")
//     .attr("dy", "3.5em")
//     .attr("text-anchor", "middle")
//     .attr("font-size", "12px")
//     .text(d => d.data.occupation)
//     .style("opacity", 0);

// function showTooltip(event, d) {
//     d3.select(this).select("rect")
//         .transition()
//         .duration(300)
//         .attr("width", nodeWidth * 1.2)
//         .attr("height", nodeHeight * 1.5)
//         .attr("x", -nodeWidth * 1.2 / 2)
//         .attr("y", -nodeHeight * 1.5 / 2);

//     d3.select(this).select(".birth")
//         .transition()
//         .duration(300)
//         .style("opacity", 1);

//     d3.select(this).select(".occupation")
//         .transition()
//         .duration(300)
//         .style("opacity", 1);
// }

// function hideTooltip() {
//     d3.select(this).select("rect")
//         .transition()
//         .duration(300)
//         .attr("width", nodeWidth)
//         .attr("height", nodeHeight)
//         .attr("x", -nodeWidth / 2)
//         .attr("y", -nodeHeight / 2);

//     d3.select(this).select(".birth")
//         .transition()
//         .duration(300)
//         .style("opacity", 0);

//     d3.select(this).select(".occupation")
//         .transition()
//         .duration(300)
//         .style("opacity", 0);
// }

// node.on("mouseover", showTooltip)
//     .on("mouseout", hideTooltip);

// const bounds = g.node().getBBox();
// const fullWidth = bounds.width;
// const fullHeight = bounds.height;
// const scale = Math.min(width / fullWidth, height / fullHeight) * 0.9;
// const translateX = (width - fullWidth * scale) / 2 - bounds.x * scale;
// const translateY = (height - fullHeight * scale) / 2 - bounds.y * scale;

// svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));