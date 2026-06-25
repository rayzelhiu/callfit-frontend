export default function TemplateForm({
  form,
  setForm,
}) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Template Name
        </label>

        <input
          className="form-control"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">
          Description
        </label>

        <textarea
          className="form-control"
          rows="3"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />
      </div>

      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Warmup Duration
          </label>

          <input
            type="number"
            className="form-control"
            value={form.warmup_duration}
            onChange={(e) =>
              setForm({
                ...form,
                warmup_duration: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Work Duration
          </label>

          <input
            type="number"
            className="form-control"
            value={form.work_duration}
            onChange={(e) =>
              setForm({
                ...form,
                work_duration: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Rest Duration
          </label>

          <input
            type="number"
            className="form-control"
            value={form.rest_duration}
            onChange={(e) =>
              setForm({
                ...form,
                rest_duration: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Cooldown Duration
          </label>

          <input
            type="number"
            className="form-control"
            value={form.cooldown_duration}
            onChange={(e) =>
              setForm({
                ...form,
                cooldown_duration: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Switch Duration
          </label>

          <input
            type="number"
            className="form-control"
            value={form.switch_duration}
            onChange={(e) =>
              setForm({
                ...form,
                switch_duration: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Total Rounds
          </label>

          <input
            type="number"
            className="form-control"
            value={form.total_rounds}
            onChange={(e) =>
              setForm({
                ...form,
                total_rounds: e.target.value,
              })
            }
          />
        </div>

        <div className="col-md-12">
          <label className="form-label fw-semibold">
            Total Sets
          </label>

          <input
            type="number"
            className="form-control"
            value={form.total_sets}
            onChange={(e) =>
              setForm({
                ...form,
                total_sets: e.target.value,
              })
            }
          />
        </div>

      </div>
    </>
  );
}