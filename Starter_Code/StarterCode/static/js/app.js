// Function to fetch data from samples.json
function getData() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    // Extracting necessary data
    var samples = data.samples;
    var metadata = data.metadata;
    var dropdown = d3.select("#selDataset");

    // Populating dropdown menu
    samples.forEach(sample => {
      dropdown.append("option").text(sample.id).property("value", sample.id);
    });

    // Default charts
    var defaultSample = samples[0];
    updateBarChart(defaultSample);
    updateBubbleChart(defaultSample); // Adding bubble chart

    // Display metadata for default sample
    var defaultMetadata = metadata.find(entry => entry.id === parseInt(defaultSample.id)); // Parse defaultSample.id to integer
    displaySampleMetadata(defaultMetadata);
  });
}

// Function to update bar chart based on selected sample
function updateBarChart(sample) {
  var sampleValues = sample.sample_values.slice(0, 10).reverse();
  var otuIDs = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  var otuLabels = sample.otu_labels.slice(0, 10).reverse();

  var trace = {
    x: sampleValues,
    y: otuIDs,
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  var data = [trace];

  var layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU ID" }
  };

  Plotly.newPlot("bar", data, layout);
}

// Function to update bubble chart based on selected sample
function updateBubbleChart(sample) {
  var trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    mode: 'markers',
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids
    },
    text: sample.otu_labels
  };

  var data = [trace];

  var layout = {
    title: 'OTU ID Bubble Chart',
    showlegend: false,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' }
  };

  Plotly.newPlot('bubble', data, layout);
}

// Function to display sample metadata
function displaySampleMetadata(metadata) {
  var metadataPanel = d3.select("#sample-metadata");

  // Clear existing metadata
  metadataPanel.html("");

  // Iterate through each key-value pair in the metadata and display it
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key.toUpperCase()}: ${value}`);
  });
}

// Function to handle dropdown change
function optionChanged(sampleID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    var samples = data.samples;
    var metadata = data.metadata;
    var selectedSample = samples.find(sample => sample.id === sampleID);
    var selectedMetadata = metadata.find(entry => entry.id === parseInt(sampleID)); // Parse sampleID to integer
    updateBarChart(selectedSample);
    updateBubbleChart(selectedSample); // Update bubble chart
    displaySampleMetadata(selectedMetadata); // Display metadata
  });
}

// Initialize
getData();
