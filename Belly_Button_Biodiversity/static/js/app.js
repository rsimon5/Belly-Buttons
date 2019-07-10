function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PAN = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PAN.html("") 

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PAN.append("h6").text(`${key}: ${value}`);
      console.log(key,value)
    });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    const X = data.otu_ids;
    const Z = data.otu_labels;
    const Y = data.sample_values;
    console.log(X, Y, Z)
    // @TODO: Build a Bubble Chart using the sample data

    var trace_bubble = {
      x: X,
      y: Y,
      text: Z,
      mode: 'markers',
      marker: {
        size: Y,
        color: X
      }
    };

    var data = [trace_bubble];

    var layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data1 = [{
        values: Y.slice(0,10),
        labels: X.slice(0, 10),
        hovertext: Z.slice(0, 10),
        type: 'pie'
      }];

      var layout = {
        margin: { t: 0, l: 0 }
      };

      Plotly.newPlot('pie', data1, layout);
    })
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
