import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { PiDotsSixVerticalBold } from "react-icons/pi";


import "./TemplateDetail.css";

import {
  getWarmups,
} from "../../services/warmupService";

import {
  getStations,
} from "../../services/workoutStationService";

import {
  getCooldowns,
} from "../../services/cooldownService";

import {
  getTemplateById,
} from "../../services/templateService";

import { getExercises }
from "../../services/exerciseService";


import { FaPlay } from "react-icons/fa";
import Modal from "./components/Modal";
import { WiDayLightWind } from "react-icons/wi";

import {
  createWarmup,
} from "../../services/warmupService";

import {
  createStation,
  reorderStations,
  deleteStation,
} from "../../services/workoutStationService";

import {
  reorderWarmups,
} from "../../services/warmupService";

import {
  reorderCooldowns,
} from "../../services/cooldownService";

import {
  createCooldown,
} from "../../services/cooldownService";

import {
  deleteWarmup,
} from "../../services/warmupService";


import {
  deleteCooldown,
} from "../../services/cooldownService";


export default function TemplateDetailPage() {
  const { id } = useParams();

  const [warmups, setWarmups] = useState([]);
  const [stations, setStations] = useState([]);
  const [cooldowns, setCooldowns] = useState([]);

  const [videoModal, setVideoModal] = useState(false);  
  const [selectedVideo, setSelectedVideo] = useState("");

  const [template, setTemplate] = useState(null);

  const [addModal, setAddModal] = useState(false);

  const [selectedType, setSelectedType] =
  useState("");

  const [selectedExercise, setSelectedExercise] =
  useState("");

  const [exerciseOptions, setExerciseOptions] =
  useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
            templateRes,
            warmupRes,
            stationRes,
            cooldownRes,
        ] = await Promise.all([
            getTemplateById(id),
            getWarmups(id),
            getStations(id),
            getCooldowns(id),
        ]);

      setTemplate(
        templateRes.data?.data ||
        templateRes.data
        );

      setWarmups(
        warmupRes.data?.data ||
        warmupRes.data ||
        []
      );

      setStations(
        stationRes.data?.data ||
        stationRes.data ||
        []
      );

      setCooldowns(
        cooldownRes.data?.data ||
        cooldownRes.data ||
        []
      );
    } catch (error) {
      console.error(error);
    }
  };


  const handleAddExercise = async () => {
  try {
    const payload = {
      template_id: id,
      exercise_id: selectedExercise,
    };

    if (selectedType === "warmup") {
      await createWarmup(payload);
    }

    if (selectedType === "workout") {
      await createStation(payload);
    }

    if (selectedType === "cooldown") {
      await createCooldown(payload);
    }

    setAddModal(false);
    setSelectedExercise("");
    setSelectedType("");

    await loadData();
    
    toast.success("Exercise added successfully!");
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteItem = async () => {
  try {

    if (deleteType === "warmup") {
      await deleteWarmup(
        selectedItem.id
      );
    }

    if (deleteType === "workout") {
      await deleteStation(
        selectedItem.id
      );
    }

    if (deleteType === "cooldown") {
      await deleteCooldown(
        selectedItem.id
      );
    }

    setDeleteModal(false);
    setSelectedItem(null);
    setDeleteType("");

    await loadData();

    
    toast.success("Deleted successfully");

  } catch (error) {
    console.error(error);
  }
};

const handleDragEnd = async (
  result
) => {

  if (
    !result.destination
  ) {
    return;
  }

  const items = [
    ...stations
  ];

  const [movedItem] =
    items.splice(
      result.source.index,
      1
    );

  items.splice(
    result.destination.index,
    0,
    movedItem
  );

  setStations(items);

  const payload =
    items.map(
      (
        item,
        index
      ) => ({
        id: item.id,
        station_number:
          index + 1,
      })
    );

  try {

    await reorderStations(
      payload
    );

    await loadData();

    toast.success(
      "Order updated"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to reorder"
    );
  }
};

const handleWarmupDrag = async (result) => {
  if (!result.destination) return;

  const items = [...warmups];

  const [moved] = items.splice(result.source.index, 1);

  items.splice(result.destination.index, 0, moved);

  setWarmups(items);

  const payload = items.map((item, index) => ({
    id: item.id,
    sort_order: index + 1,
  }));

  await reorderWarmups(payload);

  await loadData();

  toast.success("Warmup reordered");
};


const handleCooldownDrag = async (result) => {
  if (!result.destination) return;

  const items = [...cooldowns];

  const [moved] = items.splice(result.source.index, 1);

  items.splice(result.destination.index, 0, moved);

  setCooldowns(items);

  const payload = items.map((item, index) => ({
    id: item.id,
    sort_order: index + 1,
  }));

  await reorderCooldowns(payload);

  await loadData();

  toast.success("Cooldown reordered");
};


const [deleteModal, setDeleteModal] =
  useState(false);

const [deleteType, setDeleteType] =
  useState("");

const [selectedItem, setSelectedItem] =
  useState(null);

return (
  <>
    <div className="container-fluid p-4">

   <div
  className="bg-white rounded-4 shadow-sm p-4 mb-4"
>
    <h1
        className="fw-bold text-center mb-2"
        style={{
        color: "#212529",
        fontSize: "2.3rem",
        }}
    >
        {template?.name}
    </h1>

    <p
        className="text-muted text-center mb-4"
        style={{
        maxWidth: "700px",
        margin: "0 auto",
        }}
    >
        {template?.description}
    </p>


  <div className="row g-3">

    <div className="col-md-4">
      <div
  className="rounded-3 p-3 text-center"
  style={{
    background: "#fff5f5",
    border: "2px solid #dc3545",
  }}
>
  <div
    className="fw-bold text-danger"
  >
    Warmup
  </div>

  <div className="fs-3 fw-bold">
    {warmups.length}
  </div>

  <small className="text-muted">
    Exercises
  </small>
</div>
    </div>

    <div className="col-md-4">
      <div
  className="rounded-3 p-3 text-center"
  style={{
    background: "#f5f8ff",
    border: "2px solid #123473",
  }}
>
  <div
    className="fw-bold"
    style={{
      color: "#123473",
    }}
  >
    Workout
  </div>

  <div className="fs-3 fw-bold">
    {stations.length}
  </div>

  <small className="text-muted">
    Exercises
  </small>
</div>
    </div>

    <div className="col-md-4">
      <div
  className="rounded-3 p-3 text-center"
  style={{
    background: "#fffdf4",
    border: "2px solid #d4af37",
  }}
>
  <div
    className="fw-bold"
    style={{
      color: "#d4af37",
    }}
  >
    Cooldown
  </div>

  <div className="fs-3 fw-bold">
    {cooldowns.length}
  </div>

  <small className="text-muted">
    Exercises
  </small>
</div>
    </div>

  </div>

</div>

      <div className="row g-4">

        {/* WARMUP */}

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">

            <div
              className="card-header"
              style={{
                background: "#dc3545",
                color: "#fff",
              }}
            >
              <div>
                <h5 className="fw-bold mb-1">
                    🔥 Warmup
                </h5>

                </div>
            </div>

            <div className="card-body">

              {warmups.length > 0 ? (

               <DragDropContext onDragEnd={handleWarmupDrag}>
  <Droppable droppableId="warmups">
    {(provided) => (
      <ul
        className="list-group list-group-flush"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {warmups.map((item, index) => (
          <Draggable
            key={item.id}
            draggableId={item.id.toString()}
            index={index}
          >
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                className="list-group-item"
              >
                <div className="d-flex justify-content-between align-items-center">

                  {/* DRAG HANDLE + ORDER */}
                  <div className="d-flex align-items-center">

                    <span
                      {...provided.dragHandleProps}
                      className="me-2"
                      style={{ cursor: "grab" }}
                    >
                      <PiDotsSixVerticalBold />
                    </span>

                    <span className="fw-bold me-2">
                      {item.sort_order}
                    </span>

                    <strong>
                      {item.exercise?.name}
                    </strong>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="d-flex gap-2">
            {item.exercise?.video_url && (
  <button
    className="btn btn-sm btn-light"
    onClick={() => {
      setSelectedVideo(item.exercise.video_url);
      setVideoModal(true);
    }}
  >
    <FaPlay />
  </button>
)}
                   
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setDeleteType("warmup");
                        setSelectedItem(item);
                        setDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </li>
            )}
          </Draggable>
        ))}

        {provided.placeholder}
      </ul>
    )}
  </Droppable>
</DragDropContext>

              ) : (
                <p className="text-muted mb-0">
                  No warmup exercises
                </p>
              )}
                    <div className="text-center mt-3">
                        <button
                            className="btn btn-outline-danger px-4"
                            onClick={async () => {
                            const res = await getExercises();

                            const data =
                                res.data?.data ||
                                res.data ||
                                [];

                            setExerciseOptions(
                                data.filter(
                                (x) => x.category === "warmup"
                                )
                            );

                            setSelectedType("warmup");
                            setAddModal(true);
                            }}
                        >
                            + Add Warmup
                        </button>
                        </div>
                                    </div>

          </div>
        </div>

        {/* WORKOUT */}

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">

            <div
              className="card-header"
              style={{
                background: "#123473",
                color: "#fff",
              }}
            >
              <div>
                <h5 className="fw-bold mb-1">
                    🏋️ Workout
                </h5>
                </div>
            </div>

            <div className="card-body">

              {stations.length > 0 ? (

               <DragDropContext
  onDragEnd={
    handleDragEnd
  }
>
  <Droppable
    droppableId="stations"
  >
    {(provided) => (
      <ul
        className="list-group list-group-flush"
        ref={
          provided.innerRef
        }
        {...provided.droppableProps}
      >

        {stations.map(
          (
            item,
            index
          ) => (

          <Draggable
            key={item.id}
            draggableId={item.id.toString()}
            index={index}
          >

            {(provided) => (

            <li
              ref={
                provided.innerRef
              }
              {...provided.draggableProps}
              className="list-group-item"
            >

              <div
                className="d-flex justify-content-between align-items-center"
              >

                <div
                  className="d-flex align-items-center"
                >

                  <span
                    {...provided.dragHandleProps}
                    className="me-2"
                    style={{
                      cursor:
                        "grab",
                    }}
                  >
                    <PiDotsSixVerticalBold />
                  </span>

                  <span
                    className="badge me-2"
                    style={{
                      background:
                        "#123473",
                    }}
                  >
                    Station {
                      item.station_number
                    }
                  </span>

                  <strong>
                    {
                      item.exercise
                        ?.name
                    }
                  </strong>

                </div>

                <div
                  className="d-flex gap-2"
                >

                  {item.exercise?.video_url && (
                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => {
                          setSelectedVideo(item.exercise.video_url);
                          setVideoModal(true);
                        }}
                      >
                        <FaPlay />
                      </button>
                    )}

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setDeleteType(
                        "workout"
                      );

                      setSelectedItem(
                        item
                      );

                      setDeleteModal(
                        true
                      );
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </li>

            )}

          </Draggable>

        ))}

        {
          provided.placeholder
        }

      </ul>
    )}
  </Droppable>
</DragDropContext>

              ) : (
                <p className="text-muted mb-0">
                  No workout exercises
                </p>
              )}
<div className="text-center mt-3">
  <button
    className="btn workout-btn px-4"
    
    onClick={async () => {
      const res = await getExercises();

      const data =
        res.data?.data ||
        res.data ||
        [];

      setExerciseOptions(
        data.filter(
          (x) => x.category === "workout"
        )
      );

      setSelectedType("workout");
      setAddModal(true);
    }}
  >
    + Add Workout
  </button>
</div>
            </div>

          </div>
        </div>

        {/* COOLDOWN */}

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">

            <div
              className="card-header"
              style={{
                background: "#d4af37",
                color: "#000",
              }}
            >
              <div>
                <h5 className="fw-bold mb-1 text-white">
                    🧘 Cooldown
                </h5>
                </div>
            </div>

            <div className="card-body">

              {cooldowns.length > 0 ? (

               <DragDropContext
  onDragEnd={handleCooldownDrag}
>
  <Droppable
    droppableId="cooldowns"
  >
    {(provided) => (
      <ul
        className="list-group list-group-flush"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >

        {cooldowns.map(
          (item, index) => (

          <Draggable
            key={item.id}
            draggableId={item.id.toString()}
            index={index}
          >

            {(provided) => (

            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="list-group-item"
            >

              <div
                className="d-flex justify-content-between align-items-center"
              >

                <div
                  className="d-flex align-items-center"
                >

                  <span
                    {...provided.dragHandleProps}
                    className="me-2"
                    style={{
                      cursor: "grab",
                    }}
                  >
                    <PiDotsSixVerticalBold />
                  </span>

                  <span
                    className="fw-bold me-2"
                  
                  >
                    {item.sort_order}
                  </span>

                  <strong>
                    {item.exercise?.name}
                  </strong>

                </div>

                <div
                  className="d-flex gap-2"
                >
  {item.exercise?.video_url && (
  <button
    className="btn btn-sm btn-light"
    onClick={() => {
      setSelectedVideo(item.exercise.video_url);
      setVideoModal(true);
    }}
  >
    <FaPlay />
  </button>
)}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setDeleteType(
                        "cooldown"
                      );

                      setSelectedItem(
                        item
                      );

                      setDeleteModal(
                        true
                      );
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </li>

            )}

          </Draggable>

        ))}

        {provided.placeholder}

      </ul>
    )}
  </Droppable>
</DragDropContext>

              ) : (
                <p className="text-muted mb-0">
                  No cooldown exercises
                </p>
              )}
<div className="text-center mt-3">
  <button
    className="btn cooldown-btn  px-4"
   
    onClick={async () => {
      const res = await getExercises();

      const data =
        res.data?.data ||
        res.data ||
        [];

      setExerciseOptions(
        data.filter(
          (x) => x.category === "cooldown"
        )
      );

      setSelectedType("cooldown");
      setAddModal(true);
    }}
  >
    + Add Cooldown
  </button>
</div>
            </div>

          </div>
        </div>

      </div>

    </div>

    {videoModal && (
      <Modal
        title="Exercise Preview"
        onClose={() => {
          setVideoModal(false);
          setSelectedVideo("");
        }}
      >
        <div
  style={{
    width: "100%",
    maxHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden",
  }}
>
  <video
    controls
    autoPlay
    style={{
      maxWidth: "100%",
      maxHeight: "70vh",
      objectFit: "contain",
      borderRadius: "12px",
    }}
  >
    <source src={selectedVideo} />
  </video>
</div>
      </Modal>
    )}{addModal && (

  <Modal
    title={`Add ${selectedType}`}
    onClose={() => {
      setAddModal(false);
      setSelectedExercise("");
    }}
  >
    <select
      className="form-select"
      value={selectedExercise}
      onChange={(e) =>
        setSelectedExercise(e.target.value)
      }
    >
      <option value="">
        Select Exercise
      </option>

      {exerciseOptions.map((item) => (
        <option
          key={item.id}
          value={item.id}
        >
          {item.name}
        </option>
      ))}
    </select>

    <button
      className="btn btn-primary w-100 mt-3"
      disabled={!selectedExercise}
      onClick={handleAddExercise}
    >
      Save
    </button>
  </Modal>
  
)}

{deleteModal && (
  <Modal
    title={`Delete ${deleteType}`}
    onClose={() => {
      setDeleteModal(false);
      setSelectedItem(null);
      setDeleteType("");
    }}
  >
    <p className="text-center">
      Are you sure want to delete
      <br />

      <b>
        {
          selectedItem?.exercise
            ?.name
        }
      </b>

      ?
    </p>

    <button
      className="btn btn-danger w-100 mt-3"
      onClick={handleDeleteItem}
    >
      Delete
    </button>
  </Modal>
)}
    
  </>
  
);

}