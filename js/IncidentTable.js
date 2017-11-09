class IncidentTable {
  constructor(parent) {
    this.table = parent.append("table");

    this.thead = this.table.append("thead");
    let trHead = this.thead.append("tr");
    let headData = ["Title", "Date", "State"];
    trHead.selectAll("td").data(headData).enter()
      .append("td")
      .text((d) => {
        return d;
      });

    this.tbody = this.table.append("tbody");
  }

  update(data) {
    let tr = this.tbody.selectAll("tr").data(data);
    let trEnter = tr.enter()
      .append("tr");
    let trMerged = tr.merge(trEnter);

    let td = trMerged
      .selectAll("td").data((d) => {
        return [
          { class: "col-title", value: d.title },
          { class: "col-date", value: d.date },
          { class: "col-state", value: d.state }
        ]
      });
    let tdEnter = td.enter()
      .append("td")
      .attr("class", (d) => {
        return d.class;
      });

    trMerged.selectAll("td.col-title")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-date")
      .html((d) => { return d.value; })
    trMerged.selectAll("td.col-state")
      .html((d) => { return d.value; })
  }
}