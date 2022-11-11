mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb240MnV3IiwiYSI6ImNsYThybjA1YzAxYzgzb21pbjFhemRicmwifQ.UV3JfL1eYeQ89UEWfEqiZA';
        
        let map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/satellite-v9', // style URL
            zoom: 5.5, // starting zoom
            center: [138, 38] // starting center
        }); 

        async function geojsonFetch() {
            // make variables for the function
            let response, earthquakes, japan, table;
            response = await fetch('assets/earthquakes.geojson'); //get earthquakes data
            earthquakes = await response.json();
            response = await fetch('assets/japan.geojson'); //get japan data
            japan = await response.json();

            //load data to the map as new layers and table on the side.
            map.on('load', function loadingData() {

                // add earthquakes
                map.addSource('earthquakes', {
                    type: 'geojson',
                    data: earthquakes
                });

                map.addLayer({
                    'id': 'earthquakes-layer',
                    'type': 'circle',
                    'source': 'earthquakes',
                    'paint': {
                        'circle-radius': 8,
                        'circle-stroke-width': 2,
                        'circle-color': 'red',
                        'circle-stroke-color': 'white'
                    }
                });

                // add Japan 
                map.addSource('japan', {
                    type: 'geojson',
                    data: japan
                });

                map.addLayer({
                    'id': 'japan-layer',
                    'type': 'fill',
                    'source': 'japan',
                    'paint': {
                        'fill-color': '#0080ff', // blue color fill
                        'fill-opacity': 0.5
                    }
                });
            });

            // make a table for our earthquakes data, inside function where we made earthquakes variable
            table = document.getElementsByTagName("table")[0];
                // make variables to make a table
                let row, cell1, cell2, cell3;
                for (let i = 0; i < earthquakes.features.length; i++) {
                    // Create an empty <tr> element and add it to the 1st position of the table:
                    row = table.insertRow(-1);
                    cell1 = row.insertCell(0);
                    cell2 = row.insertCell(1);
                    cell3 = row.insertCell(2);
                    cell1.innerHTML = earthquakes.features[i].properties.id;
                    cell2.innerHTML = earthquakes.features[i].properties.mag;
                    // put timestamp into date format
                    cell3.innerHTML = new Date(earthquakes.features[i].properties.time).toLocaleDateString("en-US");
            }
        };

        // call the function we just made
        geojsonFetch();

        // connect html element button to our code
        let btn = document.getElementsByTagName("button")[0];
        btn.addEventListener('click', sortTable);

        // define the function to sort table
        function sortTable(e) {
            let table, rows, switching, i, x, y, shouldSwitch;
            table = document.getElementsByTagName("table")[0];
            switching = true;
            /*Make a loop that will continue until
            no switching has been done:*/
            while (switching) {
                //start by saying: no switching is done:
                switching = false;
                rows = table.rows;
                /*Loop through all table rows (except the
                first, which contains table headers):*/
                for (i = 1; i < (rows.length - 1); i++) {
                    //start by saying there should be no switching:
                    shouldSwitch = false;
                    /*Get the two elements you want to compare,
                    one from current row and one from the next:*/
                    x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
                    y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
                    //check if the two rows should switch place:
                    if (x < y) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
                if (shouldSwitch) {
                    /*If a switch has been marked, make the switch
                    and mark that a switch has been done:*/
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }
        }