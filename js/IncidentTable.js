class IncidentTable {
  constructor(parent) {
    this.div = parent.append("div");
    this.table = this.div.append("table");

    this.thead = this.table.append("thead");
    let trHead = this.thead.append("tr");
    let headData = ["Title", "Date", "State", "Killed", "Injured", "Total Victims", "Location", "Area"];
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

    let formatDate = function(date) {
      let m = date.month.toString();
      if (m.length == 1) m = "0" + m;

      let d = date.day.toString();
      if (d.length == 1) d = "0" + d;
      return date.year.toString() + "/" + m + "/" + d
    }
    let td = trMerged
      .selectAll("td").data((d) => {
        return [
          { class: "col-title", value: d.title },
          { class: "col-date", value: formatDate(d.date) },
          { class: "col-state", value: d.state },
          { class: "col-killed", value: d.killed },
          { class: "col-injured", value: d.injured },
          { class: "col-total-victims", value: d.injured + d.killed },
          { class: "col-location", value: d.location },
          { class: "col-area", value: d.area }
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
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-state")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-killed")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-injured")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-total-victims")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-location")
      .html((d) => { return d.value; });
      trMerged.selectAll("td.col-area")
      .html((d) => { return d.value; });
  }
}