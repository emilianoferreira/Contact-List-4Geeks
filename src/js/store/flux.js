const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      nombreAgenda: "",
      contacts: [],
      agendas: [],
      agendaPreview: {
        slug: "",
        contacts: [],
      },
      nuevaAgenda: {},
      id: "",
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      loadSomeData: () => {
        /**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },

      crearAgenda: async () => {
        const store = getStore();
        const actions = getActions();
        const slug = store.nombreAgenda?.trim();

        if (!slug) {
          return {
            success: false,
            message: "El nombre de la agenda es obligatorio.",
          };
        }

        const nuevaAgenda = {
          slug,
          id: Math.random(),
        };

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${nuevaAgenda.slug}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(nuevaAgenda),
            }
          );

          if (!response.ok) {
            let errorMessage = `Error en la respuesta: ${response.status}`;
            try {
              const errorData = await response.json();
              if (errorData?.msg) errorMessage = errorData.msg;
            } catch (jsonError) {
              console.warn(
                "No se pudo parsear el error de la agenda",
                jsonError
              );
            }
            return { success: false, message: errorMessage };
          }

          const data = await response.json();
          setStore({ nombreAgenda: slug });
          await actions.obtenerAgendas();
          return {
            success: true,
            message:
              data?.message || data?.msg || "Agenda creada correctamente.",
          };
        } catch (error) {
          console.error("Error al crear la agenda:", error);
          return {
            success: false,
            message: "No se pudo crear la agenda. Intenta nuevamente.",
          };
        }
      },

      setNombreAgenda: (nombre) => {
        setStore({ nombreAgenda: nombre });
      },
      obtenerAgendas: async () => {
        try {
          const response = await fetch(
            "https://playground.4geeks.com/contact/agendas"
          );

          if (!response.ok) {
            return {
              success: false,
              message: `No se pudieron obtener las agendas (${response.status}).`,
            };
          }

          const payload = await response.json();
          const rawAgendas = Array.isArray(payload)
            ? payload
            : payload?.agendas || [];
          const agendas = rawAgendas
            .map((item) => {
              if (typeof item === "string") {
                return { slug: item };
              }
              if (item && typeof item === "object") {
                const slug =
                  item.slug ||
                  item.name ||
                  item.agenda ||
                  (typeof item.id === "string" ? item.id : "");
                return {
                  ...item,
                  slug: slug || "",
                };
              }
              return { slug: String(item || "") };
            })
            .filter((agenda) => agenda.slug);

          setStore({ agendas });

          return {
            success: true,
            agendas,
          };
        } catch (error) {
          console.error("Error al obtener las agendas:", error);
          return {
            success: false,
            message: "No se pudieron cargar las agendas. Intenta nuevamente.",
          };
        }
      },
      limpiarAgendaPreview: () => {
        setStore({
          agendaPreview: {
            slug: "",
            contacts: [],
          },
        });
      },
      previsualizarAgenda: async (slug) => {
        const agendaSlug = slug?.trim();
        if (!agendaSlug) {
          setStore({
            agendaPreview: {
              slug: "",
              contacts: [],
            },
          });
          return {
            success: false,
            message: "Selecciona una agenda válida para previsualizar.",
          };
        }

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${agendaSlug}/contacts`
          );

          if (!response.ok) {
            return {
              success: false,
              message: `No se pudieron obtener los contactos (${response.status}).`,
            };
          }

          const data = await response.json();
          const contacts = data?.contacts || [];

          setStore({
            agendaPreview: {
              slug: agendaSlug,
              contacts,
            },
          });

          return {
            success: true,
            contacts,
          };
        } catch (error) {
          console.error("Error al previsualizar la agenda:", error);
          return {
            success: false,
            message:
              "No se pudo cargar la previsualización de contactos. Intenta nuevamente.",
          };
        }
      },
      seleccionarAgenda: async (slug) => {
        const agendaSlug = slug?.trim();
        if (!agendaSlug) {
          return {
            success: false,
            message: "Selecciona una agenda válida.",
          };
        }

        const result = await getActions().obtenerContactos(agendaSlug);
        if (result?.success) {
          setStore({ nombreAgenda: agendaSlug });
        }

        return result;
      },
      obtenerContactos: async (slug) => {
        const store = getStore();
        const agendaSlug = (slug ?? store.nombreAgenda)?.trim();

        if (!agendaSlug) {
          setStore({ contacts: [] });
          return {
            success: false,
            message: "Selecciona una agenda para ver sus contactos.",
          };
        }
        const url = `https://playground.4geeks.com/contact/agendas/${agendaSlug}/contacts`;
        try {
          const response = await fetch(url);

          if (!response.ok) {
            let errorMessage = `Error en la respuesta: ${response.status}`;
            try {
              const errorData = await response.json();
              if (errorData?.msg) errorMessage = errorData.msg;
            } catch (jsonError) {
              console.warn(
                "No se pudo parsear el error de la agenda al obtener contactos",
                jsonError
              );
            }
            return { success: false, message: errorMessage };
          }
          const data = await response.json();

          const contacts = data?.contacts || [];

          const newState = {
            contacts,
          };
          if (typeof slug === "string") {
            newState.nombreAgenda = agendaSlug;
          }

          setStore({
            ...newState,
            agendaPreview: {
              slug: "",
              contacts: [],
            },
          });

          return {
            success: true,
            message: "Agenda cargada correctamente.",
            contacts,
          };
        } catch (e) {
          console.error(`Manejo interno del error: ${e.message}`);
          return {
            success: false,
            message: "No se pudieron cargar los contactos. Intenta nuevamente.",
          };
        }
      },
      goEditContact: async (body, id) => {
        const actions = getActions();
        const store = getStore();
        const agendaSlug = store.nombreAgenda?.trim();

        if (!agendaSlug) {
          return {
            success: false,
            message: "Selecciona una agenda antes de editar un contacto.",
          };
        }

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${agendaSlug}/contacts/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            let errorMessage = "No se pudo actualizar el contacto.";
            try {
              const errorData = await response.json();
              if (errorData?.msg) errorMessage = errorData.msg;
            } catch (jsonError) {
              console.warn(
                "No se pudo parsear el error del contacto en goEditContact",
                jsonError
              );
            }
            return { success: false, message: errorMessage };
          }

          const data = await response.json();
          await actions.obtenerContactos();
          return {
            success: true,
            message:
              data?.message ||
              data?.msg ||
              "Contacto actualizado correctamente.",
          };
        } catch (error) {
          console.error("Error al editar el contacto en goEditContact:", error);
          return {
            success: false,
            message: "Ocurrió un error inesperado al actualizar el contacto.",
          };
        }
      },

      editarContacto: async (body, id) => {
        const store = getStore();
        const actions = getActions();
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${store.nombreAgenda}/contacts/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            let errorMessage = "No se pudo actualizar el contacto.";
            try {
              const errorData = await response.json();
              if (errorData?.msg) errorMessage = errorData.msg;
            } catch (jsonError) {
              console.warn(
                "No se pudo parsear el error del contacto",
                jsonError
              );
            }
            return { success: false, message: errorMessage };
          }

          const data = await response.json();
          await actions.obtenerContactos();
          return {
            success: true,
            message:
              data?.message ||
              data?.msg ||
              "Contacto actualizado correctamente.",
          };
        } catch (error) {
          console.error("Error al editar el contacto:", error);
          return {
            success: false,
            message: "Ocurrió un error inesperado al actualizar el contacto.",
          };
        }
      },

      eliminarContacto: async (id) => {
        const store = getStore();
        const actions = getActions();
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${store.nombreAgenda}/contacts/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("No se pudo eliminar");
          }

          await actions.obtenerContactos(); // Para actualizar la lista de contactos
        } catch (error) {
          console.error("Error al eliminar el contacto:", error);
        }
      },
    },
  };
};

export default getState;
