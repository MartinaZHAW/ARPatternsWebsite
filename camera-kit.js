import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from "@snap/camera-kit";

async function startUp() {
  const token = import.meta.env.VITE_API_KEY;
  const cameraKit = await bootstrapCameraKit({
    apiToken: token
  });

  const liveRenderTarget = document.getElementById('canvas');
  const session = await cameraKit.createSession({ liveRenderTarget });

  let mediaStream = null;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        // aspectRatio: { exact: 0.56 }
      }
    });

    const source = createMediaStreamSource(mediaStream, {
      transform: Transform2D.MirrorX,
      cameraType: 'front'
    });
  
    await session.setSource(source);
    await session.play();
  }
  catch (err) {
    const errorMessageElement = document.getElementById('no-camera-connected-error-message');
    errorMessageElement.innerHTML = "The example can't be loaded because no camera is connected. Connect a camera, then reload the page!";
  }

  return [cameraKit, session];
}

let cameraKit;
let session;
let first_time = true;

const liveRenderTarget = document.getElementById('canvas');

function startLens(lensName){
  console.log(first_time);
  if (first_time) {
    startUp().then(([cameraKitReturned, sessionReturned]) => {
      cameraKit = cameraKitReturned;
      session = sessionReturned;
      displayLens(lensName);
      first_time = false;
    });
  }
  else{
    displayLens(lensName);
  }
}

window.startLens = startLens;

async function displayLens(lensName) {
  let lensID = null;
  const groupID = import.meta.env.VITE_GROUP_ID;

  if (lensName == "dragon_snacks") {
    lensID = import.meta.env.VITE_DRAGON_SNACKS_LENS_ID;
  } else if (lensName == "puppet_dance") {
    lensID = import.meta.env.VITE_PUPPET_DANCE_LENS_ID;
  } else if (lensName == "ocean_clean_up") {
    lensID = import.meta.env.VITE_OCEAN_CLEAN_UP_LENS_ID;
  } else if (lensName == "segment_overlay") {
    lensID = import.meta.env.VITE_SEGMENT_OVERLAY;
  } else if (lensName == "superimposition") {
    lensID = import.meta.env.VITE_SUPERIMPOSITION;
  } else if (lensName == "area_enrichment") {
    lensID = import.meta.env.VITE_AREA_ENRICHMENT;
  } else {
    lensID = import.meta.env.VITE_AHEAD_STAGING;
  }

  const lens = await cameraKit.lensRepository.loadLens(lensID, groupID);
  session.applyLens(lens);
  return lens;
}