// // const codapInterface = {
// //     init: async function () {
// //         // const message = await codapInterface.sendRequest({
// //         //     action: "update",
// //         //     resource: "interactiveFrame",
// //         //     values: {
// //         //         name: "Parallel Coordinates",
// //         //         dimensions: { width: 1000, height: 1000 }
// //         //     }
// //         // });
// //         // console.log("Sending message:", message);
// //         // const response = await codapInterface.sendRequest(message);
// //         // console.log("Received response:", response);
// //         const message = await codapInterface.sendRequest({
// //             action: "get",
// //             resource: "interactiveFrame"  // Or another resource, if 'interactiveFrame' isn't valid
// //         });
// //         console.log("Received data:", message);
// //     },

// //     sendRequest: async function (message) {
// //         return new Promise(resolve => {
// //             window.parent.postMessage(message, "*");
// //             window.addEventListener("message", event => resolve(event.data));
// //         });
// //     },

// //     getData: async function (collectionName) {
// //         const response = await codapInterface.sendRequest({
// //             action: "get",
// //             resource: `dataContext[${collectionName}].collection`
// //         });

// //         return response.values.cases.map(c => c.values);
// //     }
// // };

// // // Initialize plugin
// // codapInterface.init();

// const codapInterface = {
//     init: async function () {
//         // Send the update request for the interactiveFrame dimensions
//         const updateMessage = {
//             action: "update",
//             resource: "interactiveFrame",
//             values: {
//                 dimensions: { width: 1000, height: 1000 }
//             }
//         };

//         // Send the update message
//         await codapInterface.sendRequest(updateMessage);
//         console.log("Dimensions updated");

//         // Send the get request to fetch the current state of the interactiveFrame
//         const getMessage = {
//             action: "get",
//             resource: "interactiveFrame"
//         };

//         // Fetch the current state of the interactiveFrame after the update
//         const response = await codapInterface.sendRequest(getMessage);
//         console.log("Received response:", response);
//     },

//     sendRequest: async function (message) {
//         return new Promise(resolve => {
//             window.parent.postMessage(message, "*");
//             window.addEventListener("message", event => resolve(event.data));
//         });
//     },

//     getData: async function (collectionName) {
//         const response = await codapInterface.sendRequest({
//             action: "get",
//             resource: `dataContext[${collectionName}].collection`
//         });

//         return response.values.cases.map(c => c.values);
//     }
// };

// // Initialize plugin
// codapInterface.init();

/**
 * Created by bfinzer on 2/7/15.
 */

var codapHelper = {
    codapPhone: null,
    initAccomplished: false,
  
    initSim: function( simDescription, doCommandFunc) {
      this.codapPhone = new iframePhone.IframePhoneRpcEndpoint(doCommandFunc, "codap-game", window.parent);
  
      this.codapPhone.call({
        action: 'initGame',
        args: simDescription
      }, function ( iResult) {
        if( iResult)
          this.initAccomplished = true;
      }.bind(this));
    },
  
    checkForCODAP: function() {
  
      if (!this.initAccomplished) {
        window.alert('Please drag my URL to a CODAP document.');
        return false;
      }
      else
        return true;
    },
  
    createCase: function(iCollectionName, iValuesArray, iParentID, iCallback) {
      this.createCases(iCollectionName, iValuesArray, iParentID, iCallback);
    },
  
    createCases: function (iCollectionName, iValuesArrays, iParentID, iCallback) {
      //  console.log("In createCases");
      if( iValuesArrays && !Array.isArray( iValuesArrays))
        iValuesArrays = [iValuesArrays];
      this.codapPhone.call({
        action: 'createCase',
        args: {
          collection: iCollectionName,
          values: iValuesArrays,
          parent: iParentID,
          log: false
        }
      },
          iCallback
      );
    },
  
    openCase: function (iCollectionName, iValues, iCallback) {
      console.log("Open a new case in " + iCollectionName);
      if( iValues && !Array.isArray( iValues))
        iValues = [iValues];
      this.codapPhone.call({
            action: 'openCase',
            args: {
              collection: iCollectionName,
              values: iValues
            }
          },
          iCallback
      )
    },
  
      openParentCase: function (iCollectionName, iValues, iParentID, iCallback) {
          console.log("Opening a case in parent collection " + iCollectionName + ", case " + iParentID);
          if( iValues && !Array.isArray( iValues))
              iValues = [iValues];
          this.codapPhone.call({
                  action: 'openCase',
                  args: {
                      collection: iCollectionName,
                      values: iValues
                  }
              },
              iCallback
          )
      },
  
      closeCase: function (iCollectionName, iValues, iCaseID) {
      console.log("Close case " + iCaseID + " in " + iCollectionName);
      if( iValues && !Array.isArray( iValues))
        iValues = [iValues];
      this.codapPhone.call(
          {
            action: 'closeCase',
            args: {
              collection: iCollectionName,
              values: iValues,
              caseID: iCaseID
            }
          },
          function () {
            console.log("closeCase")
          }
      );
    }
  
  };
  
  