import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

import ExercisePage from "./ExercisePage";
import TemplatePage from "./TemplatePage";

import Modal from "../dashboard/components/Modal";
import ExerciseForm from "../dashboard/components/ExerciseForm";
import TemplateForm from "../dashboard/components/TemplateForm";

import "./Dashboard.css";

import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../../services/exerciseService";

import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../services/templateService";

import { logout } from "../../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("exercise");

  const [search, setSearch] = useState("");

  const [exercises, setExercises] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemPerPage = 5;

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [videoModal, setVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [addTemplateModal, setAddTemplateModal] =
    useState(false);

  const [editTemplateModal, setEditTemplateModal] =
    useState(false);

  const [deleteTemplateModal, setDeleteTemplateModal] =
    useState(false);

  const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
      name: "",
      description: "",
      category: "workout",
      video: null,
      thumbnail: null, // 🔥 INI WAJIB
  });

  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    warmup_duration: "",
    cooldown_duration: "",
    work_duration: "",
    rest_duration: "",
    switch_duration: "",
    total_sets: "",
    total_rounds: "",
  });

  useEffect(() => {
    fetchData();
    fetchTemplates();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getExercises();
      const data = res?.data?.data || res?.data || [];
      setExercises(data);
    } catch {
      toast.error("Failed load exercise");
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await getTemplates();
      const data = res?.data?.data || res?.data || [];
      setTemplates(data);
    } catch {
      toast.error("Failed load template");
    }
  };

 
  const resetForm = () => {
  setForm({
    name: "",
    description: "",
    category: "workout",
    video: null,
    thumbnail: null, // 🔥 INI WAJIB
  });
};

  const resetTemplateForm = () => {
    setTemplateForm({
      name: "",
      description: "",
      warmup_duration: "",
      cooldown_duration: "",
      work_duration: "",
      rest_duration: "",
      switch_duration: "",
      total_sets: "",
      total_rounds: "",
    });
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((item) =>
      (
        item.name +
        " " +
        item.description +
        " " +
        item.category
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [exercises, search]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((item) =>
      (
        item.name +
        " " +
        item.description
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [templates, search]);

  const totalPage = Math.ceil(
    filteredExercises.length / itemPerPage
  );

  const currentData = filteredExercises.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  const formatCategory = (cat) => {
    if (!cat) return "";

    return cat
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const categoryBadge = (cat) => {
    switch (cat) {
      case "warmup":
        return "badge-warmup";

      case "workout":
        return "badge-workout";

      case "cooldown":
        return "badge-cooldown";

      default:
        return "badge-secondary";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("token");

      toast.success("Logout success");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

 
  const handleCreate = async () => {
  try {
    setLoading(true);

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("category", form.category);

    if (form.video instanceof File) {
      fd.append("video", form.video);
    }

    if (form.thumbnail instanceof File) {
      fd.append("thumbnail", form.thumbnail);
    }

    await createExercise(fd);

    toast.success("Created successfully");

    setAddModal(false);
    resetForm();
    fetchData(); // 🔥 refresh list

  } catch (err) {
    console.log(err);
    toast.error("Create failed");

  } finally {
    setLoading(false); // 🔥 WAJIB BIAR GAK STUCK
  }
};

const handleUpdate = async () => {
  if (!selectedItem) return;

  try {
    setLoading(true);

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("category", form.category);

    if (form.video) fd.append("video", form.video);
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

    await updateExercise(selectedItem.id, fd);

    toast.success("Updated");

    setEditModal(false);
    setSelectedItem(null);
    resetForm();
    fetchData();

  } catch (err) {
    toast.error("Update failed");
  } finally {
    setLoading(false); // 🔥 INI WAJIB
  }
};
const handleDelete = async () => {
  try {
    await deleteExercise(selectedItem.id);

    toast.success("Deleted");

    setDeleteModal(false);

    setSelectedItem(null);

    fetchData();
  } catch {
    toast.error("Delete failed");
  }
};

const handleCreateTemplate = async () => {
  try {
    await createTemplate(templateForm);

    toast.success("Template created");

    setAddTemplateModal(false);

    resetTemplateForm();

    fetchTemplates();
  } catch {
    toast.error("Failed create template");
  }
};

const handleUpdateTemplate = async () => {
  try {
    if (!selectedTemplate) return;

    await updateTemplate(
      selectedTemplate.id,
      templateForm
    );

    toast.success("Template updated");

    setEditTemplateModal(false);

    setSelectedTemplate(null);

    resetTemplateForm();

    fetchTemplates();
  } catch {
    toast.error("Failed update template");
  }
};

const handleDeleteTemplate = async () => {
  try {
    if (!selectedTemplate) return;

    await deleteTemplate(
      selectedTemplate.id
    );

    toast.success("Template deleted");

    setDeleteTemplateModal(false);

    setSelectedTemplate(null);

    fetchTemplates();
  } catch {
    toast.error("Failed delete template");
  }
};

  return (
    <div
      style={{
        background: "#e8f5fe",
        minHeight: "100vh",
      }}
    >
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="d-flex">

        <Sidebar
          tab={tab}
          setTab={setTab}
          handleLogout={handleLogout}
        />

        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          tab={tab}
          setTab={setTab}
          handleLogout={handleLogout}
        />

        <main
          className="flex-grow-1 p-4"
          style={{
            minWidth: 0,
            overflowX: "auto",
          }}
        >

          {tab === "exercise" && (
            <ExercisePage
              search={search}
              setSearch={setSearch}
              currentData={currentData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={totalPage}
              filteredExercises={
                filteredExercises
              }
              formatCategory={formatCategory}
              categoryBadge={categoryBadge}
              setSelectedVideo={
                setSelectedVideo
              }
              setVideoModal={setVideoModal}
              setSelectedItem={setSelectedItem}
              setForm={setForm}
              setEditModal={setEditModal}
              setDeleteModal={setDeleteModal}
              resetForm={resetForm}
              setAddModal={setAddModal}
            />
          )}

          {tab === "template" && (
            <TemplatePage
              search={search}
              setSearch={setSearch}
              filteredTemplates={
                filteredTemplates
              }
              setSelectedTemplate={
                setSelectedTemplate
              }
              setTemplateForm={setTemplateForm}
              setEditTemplateModal={
                setEditTemplateModal
              }
              setDeleteTemplateModal={
                setDeleteTemplateModal
              }
              resetTemplateForm={
                resetTemplateForm
              }
              setAddTemplateModal={
                setAddTemplateModal
              }
            />
          )}

        </main>

      </div>
  <>
    <div
      style={{
        background: "#e8f5fe",
        minHeight: "100vh",
      }}
    >
      
    </div>
    {videoModal && (
      <Modal
        title="Exercise Video"
        onClose={() => {
          setVideoModal(false);
          setSelectedVideo("");
        }}
      >
        <video
          src={selectedVideo}
          controls
          autoPlay
          style={{
            width: "100%",
            maxHeight: "500px",
            borderRadius: "10px",
          }}
        />
      </Modal>
    )}

    {addModal && (
      <Modal
        title="Add Exercise"
        onClose={() => setAddModal(false)}
      >
        <ExerciseForm
          form={form}
          setForm={setForm}
        />

        <button
          className="btn btn-primary fw-bold w-100 mt-3"
          onClick={handleCreate}
        >
          Save
        </button>
      </Modal>
    )}

    {editModal && (
      <Modal
        title="Edit Exercise"
        onClose={() => setEditModal(false)}
      >
        <ExerciseForm
          form={form}
          setForm={setForm}
        />

        <button
          className="btn btn-secondary fw-bold text-white w-100 mt-3"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </Modal>
    )}

    {deleteModal && (
      <Modal
        title="Delete Exercise"
        onClose={() => setDeleteModal(false)}
      >
        <div className="text-center">
          <p className="mb-3">
            Are you sure you want to delete?
          </p>

          <h5 className="text-danger">
            {selectedItem?.name}
          </h5>
        </div>

        <button
          className="btn btn-danger w-100 mt-3"
          onClick={handleDelete}
        >
          Delete
        </button>
      </Modal>
    )}

    {addTemplateModal && (
      <Modal
        title="Add Template"
        onClose={() =>
          setAddTemplateModal(false)
        }
      >
        <TemplateForm
          form={templateForm}
          setForm={setTemplateForm}
        />

        <button
          className="btn btn-primary w-100 mt-3"
          onClick={handleCreateTemplate}
        >
          Save
        </button>
      </Modal>
    )}

    {editTemplateModal && (
      <Modal
        title="Edit Template"
        onClose={() =>
          setEditTemplateModal(false)
        }
      >
        <TemplateForm
          form={templateForm}
          setForm={setTemplateForm}
        />

        <button
          className="btn btn-secondary w-100 mt-3"
          onClick={handleUpdateTemplate}
        >
          Update
        </button>
      </Modal>
    )}

    {deleteTemplateModal && (
      <Modal
        title="Delete Template"
        onClose={() =>
          setDeleteTemplateModal(false)
        }
      >
        <p className="text-center">
          Delete{" "}
          <b>{selectedTemplate?.name}</b> ?
        </p>

        <button
          className="btn btn-danger w-100 mt-3"
          onClick={handleDeleteTemplate}
        >
          Delete
        </button>
      </Modal>
    )}
  </>

    </div>
    
  );
}