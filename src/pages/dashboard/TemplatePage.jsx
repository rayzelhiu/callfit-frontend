import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import {  handleSendToTV } from "../../services/sessionService";

export default function TemplatePage({
  search,
  setSearch,
  filteredTemplates,
  setSelectedTemplate,
  setTemplateForm,
  setEditTemplateModal,
  setDeleteTemplateModal,
  resetTemplateForm,
  setAddTemplateModal,
}) {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="fw-bold">TEMPLATE</h1>

      <div className="bg-white rounded-4 shadow-sm p-4 mt-3">
        <div className="row align-items-center g-3 mb-4">
          <div className="col-12 col-lg-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>

              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search template..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4 d-flex justify-content-lg-end">
            <button
              className="btn btn-primary w-100 w-lg-auto"
              style={{
                minWidth: "180px",
                height: "45px",
                background: "#123473",
                borderColor: "#123473",
              }}
              onClick={() => {
                resetTemplateForm();
                setAddTemplateModal(true);
              }}
            >
              <FaPlus className="me-2" />
              Add Template
            </button>
          </div>
        </div>

        <hr />

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Description</th>
                <th>Warm Up</th>
                <th>Work</th>
                <th>Rest</th>
                <th>Cool Down</th>
                <th>Switch</th>
                <th>Rounds</th>
                <th>Sets</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      {item.name}
                    </td>

                    <td
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "normal",
                      }}
                    >
                      {item.description}
                    </td>

                    <td>{item.warmup_duration} detik</td>
                    <td>{item.work_duration} detik</td>
                    <td>{item.rest_duration} detik</td>
                    <td>{item.cooldown_duration} detik</td>
                    <td>{item.switch_duration} detik</td>
                    <td>{item.total_rounds}</td>
                    <td>{item.total_sets}</td>

                    <td>
                    <div className="d-flex gap-2">

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/templates/${item.id}`)}
                      >
                        Detail
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSendToTV(item.id)}
                      >
                        Send to TV
                      </button>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedTemplate(item);

                          setTemplateForm({
                            name: item.name || "",
                            description: item.description || "",
                            warmup_duration: item.warmup_duration || "",
                            cooldown_duration: item.cooldown_duration || "",
                            work_duration: item.work_duration || "",
                            rest_duration: item.rest_duration || "",
                            switch_duration: item.switch_duration || "",
                            total_sets: item.total_sets || "",
                            total_rounds: item.total_rounds || "",
                          });

                          setEditTemplateModal(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setSelectedTemplate(item);
                          setDeleteTemplateModal(true);
                        }}
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center py-5"
                  >
                    No Template Data
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}