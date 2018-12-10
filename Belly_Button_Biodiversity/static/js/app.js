function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    let url = "/metadata/" + sample;
    let target = d3.select('#sample-metadata');
    d3.json(url).then(function (result) {
      let data = result;
    // Use `.html("") to clear any existing metadata
      target.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      target.append("p").text(key + ': ' + value);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
};

function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
  // build an api reference for the sample data
  let url = "/samples/" + sample;
  d3.json(url).then(function(result) {
    let data = result;

  //BUILD A BUBBLE CHART
    //build variables for Plotly.plot()
    var BUBBLE = document.getElementById('bubble');
    var bubbleTrace = [{
      x: data.otu_ids,
      labels: data.otu_labels,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    }];
    var bubbleLayout = {
      title: 'Bubble Chart',
      showlegend: false,
    };
    // plot
    Plotly.plot(BUBBLE, bubbleTrace, bubbleLayout);
   
  // BUILD A PIE CHART
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

  // sort dictionary to show tip 10 items when slicing()
    //link rows within the dictionary
    var linkedData = data.otu_ids.map(function(d, i) { 
      return [d, data.sample_values[i], data.otu_labels[i]]
    });
    //sort data by sample_values
    var sort = linkedData.sort(function(first, second) {
      return (second[1] - first[1])
    });
    //unlink rows to structure as original dictionary
    var sorted = {
      'otu_ids': sort.map(d => d[0]),
      'sample_values': sort.map(d => d[1]),
      'otu_labels': sort.map(d => d[2])    
    };

  // Use sorted Dictionary to slice top 10 for pie chart
    //build variables for Plotly.plot()
    var PIE = document.getElementById("pie");
    var pieTrace = [{
      labels: sorted.otu_ids.slice(0,10),
      values: sorted.sample_values.slice(0,10),
      hovertext: sorted.otu_labels.slice(0,10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];
    var pieLayout = {
      title: 'Pie Chart',
      margin: {t: 0, l:0}
    };
    //plot
    Plotly.plot(PIE, pieTrace, pieLayout);
    }
  )};

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
