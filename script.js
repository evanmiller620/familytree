const familyData = [
    { id: 1, name: "Popo mom", birthDate: '?', spouseId: 2, parentIds: [], generation: 0 },
    { id: 2, name: "Popo Dad", birthDate: '?', spouseId: 1, parentIds: [], generation: 0 },
    { id: 11, name: "Uncle Jimmy", birthDate: '?', spouseId: 12, parentIds: [1, 2], generation: 1 },
    { id: 12, name: "Auntie Lai-lin", birthDate: '?', spouseId: 11, parentIds: [], generation: 1 },
    { id: 3, name: "Po Po", birthDate: '?', spouseId: 4, parentIds: [1, 2], generation: 1 },
    { id: 13, name: "Moi", birthDate: '?', spouseId: 16, parentIds: [1, 2], generation: 1 },
    { id: 16, name: "Kevan", birthDate: '?', spouseId: 13, parentIds: [], generation: 1 },
    { id: 14, name: "Lippen", birthDate: '?', spouseId: 17, parentIds: [1, 2], generation: 1 },
    { id: 17, name: "Cindy", birthDate: '?', spouseId: 14, parentIds: [], generation: 1 },
    { id: 15, name: "Tony", birthDate: '?', spouseId: 18, parentIds: [1, 2], generation: 1 },
    { id: 18, name: "Candi", birthDate: '?', spouseId: 15, parentIds: [], generation: 1 },
    { id: 4, name: "Gung Gung", birthDate: '?', spouseId: 3, parentIds: [], generation: 1 },
    {id: 5, name: 'Wanda', birthDate: '27', spouseId: 27, parentIds: [11, 12], generation: 2},
    {id: 6, name: 'Laura', birthDate: '28', spouseId: 28, parentIds: [11, 12], generation: 2},
    {id: 7, name: 'Teri', birthDate: '29', spouseId: 29, parentIds: [11, 12], generation: 2},
    {id: 8, name: 'Ronald', birthDate: '30', spouseId: 30, parentIds: [11, 12], generation: 2},
    {id: 9, name: 'Donna', birthDate: '?', spouseId: null, parentIds: [11, 12], generation: 2},
    {id: 21, name: 'Mom', birthDate: '7/26/1963', spouseId: 22, parentIds: [3, 4], generation: 2},
    {id: 19, name: 'Kofu', birthDate: '?', spouseId: 31, parentIds: [3, 4], generation: 2},
    {id: 20, name: 'Yee-Kofu', birthDate: '?', spouseId: null, parentIds: [3, 4], generation: 2},
    {id: 22, name: 'Dad', birthDate: '2/24/1960', spouseId: 21, parentIds: [23,24], generation: 2},
    {id: 23, name: 'Grandma', birthDate: '?', spouseId: 24, parentIds: [], generation: 1},
    {id: 24, name: 'Grandpa', birthDate: '?', spouseId: 23, parentIds: [], generation: 1},
    {id: 25, name: 'Auntie Sheri', birthDate: '?', spouseId: 26, parentIds: [23, 24], generation: 2},
    {id: 26, name: 'Uncle Mark', birthDate: '?', spouseId: 25, parentIds: [], generation: 2},
    {id: 27, name: 'Warren', birthDate: '?', spouseId: 5, parentIds: [], generation: 2},
    {id: 28, name: 'Frank', birthDate: '?', spouseId: 6, parentIds: [], generation: 2},
    {id: 29, name: 'Teri', birthDate: '?', spouseId: 7, parentIds: [], generation: 2},
    {id: 30, name: 'Thuy', birthDate: '?', spouseId: 8, parentIds: [], generation: 2},
    {id: 31, name: 'Auntie Janice', birthDate: '?', spouseId: 19, parentIds: [], generation: 2},
];

const width = window.innerWidth;
const height = window.innerHeight;
const nodeWidth = 120;
const nodeHeight = 60;
const verticalSpace = 300;
const horizontalSpace = 300;

const svg = d3.select("#family-tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const g = svg.append("g");

const zoom = d3.zoom()
    .scaleExtent([0.4, 2])
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

svg.call(zoom);

function createFamilyTree() {
    const generations = d3.group(familyData, d => d.generation);
    const maxGeneration = Math.max(...generations.keys());

    
    const genCount = [];
    familyData.forEach(person => {
        genCount[person.generation] = genCount[person.generation] ? genCount[person.generation] + 1 : 1;
        if(person.spouseId) {
            genCount[person.generation] -= .5;
        }
    });


    spaceCount = [];
    const maxGenCount = Math.max(...genCount);
    for (let i = 0; i <= genCount.length; i++) {
        spaceCount[i] = (maxGenCount - genCount[i]) / 2;
    }
    
    spouses = [];
    familyData.forEach(person => {
        if (!spaceCount[person.generation]) {
            spaceCount[person.generation] = 0;
        }
        if(!spouses.includes(person.id)) {
            person.col = (person.generation) * verticalSpace;
            person.row = (spaceCount[person.generation]) * horizontalSpace;
            spaceCount[person.generation]++;
            if (person.spouseId) {
                spouses.push(person.spouseId);
            }
        }
        else {
            person.col = (person.generation) * verticalSpace;
            person.row = (spaceCount[person.generation]) * horizontalSpace;
        }
    });

    for (let i = 0; i < familyData.length; i++) {
        if(spouses.includes(familyData[i].id)) {
            const spouse = familyData.find(p => p.id === familyData[i].spouseId);
            if (spouse) {
                if (familyData[i].generation === spouse.generation) {
                    familyData[i].row  = spouse.row + nodeWidth + 20;
                }
            }
        }
    }

    const links = [];
    familyData.forEach(person => {
        if (person.parentIds.length > 0) {
            person.parentIds.forEach(parentId => {
                if(!spouses.includes(parentId)) {
                    const parent = familyData.find(p => p.id === parentId);
                    links.push({ source: parent, target: person });
                }
            });
        }
        if (person.spouseId) {
            const spouse = familyData.find(p => p.id === person.spouseId);
            if (spouse && person.id < spouse.id) {
                links.push({ source: person, target: spouse, isSpouse: true });
            }
        }
    });

    const link = g.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d => {
            if (d.isSpouse) {
                return `M${d.source.row + nodeWidth / 2},${d.source.col + nodeHeight / 2} L${d.target.row + nodeWidth / 2},${d.target.col + nodeHeight / 2}`;
            } else {
                const midX = (d.source.row + d.target.row) / 2;
                return `M${d.source.row + nodeWidth + 10},${d.source.col + nodeHeight / 2}
                        C${d.source.row + nodeWidth / 2},${(d.source.col + d.target.col) / 2}
                         ${midX},${d.target.col - horizontalSpace / 2}
                         ${d.target.row + nodeWidth / 2},${d.target.col}`;
            }
        });

    const node = g.selectAll(".person")
        .data(familyData)
        .enter().append("g")
        .attr("class", "person")
        .attr("transform", d => `translate(${d.row},${d.col})`);

    node.append("rect")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 5)
        .attr("ry", 5);

        
    node.append("text")
        .attr("class", "person-text")
        .attr("x", nodeWidth / 2)
        .attr("y", nodeHeight / 2)
        .attr("dy", "0.35em")
        .attr("fill", "black")
        .text(d => d.name)
        .call(wrap, nodeWidth - 10);

    node.append("text")
        .attr("class", "person-birthdate")
        .attr("x", nodeWidth / 2)
        .attr("y", nodeHeight / 2)
        .attr("dy", "1.5em")
        .attr("fill", "black")
        .text(d => d.birthDate)
        .style("opacity", 0);

    node.on("mouseover", function(event, d) {
        d3.select(this).select(".person-birthdate").style("opacity", 1);
        d3.select(this).select("rect").attr("width", nodeWidth + 20).attr("height", nodeHeight + 20).attr("x", -nodeWidth / 2 + 50).attr("y", -nodeHeight / 2 + 25).attr('fill', 'lightblue');
    })
    .on("mouseout", function() {
        d3.select(this).select(".person-birthdate").style("opacity", 0);
        d3.select(this).select("rect").attr("width", nodeWidth).attr("height", nodeHeight).attr("x", -nodeWidth / 2 + 60).attr("y", -nodeHeight / 2 + 30).attr('fill', 'white');
    });

    function wrap(text, width) {
        text.each(function() {
            const text = d3.select(this);
            const words = text.text().split(/\s+/).reverse();
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1;
            const y = text.attr("y");
            const dy = parseFloat(text.attr("dy"));
            let tspan = text.text(null).append("tspan").attr("x", nodeWidth / 2).attr("y", y).attr("dy", dy + "em");
            let word;
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", nodeWidth / 2).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}


document.getElementById("resetView").addEventListener("click", () => {
    svg.transition().call(zoom.transform, d3.zoomIdentity);
});

createFamilyTree();