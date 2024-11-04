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
        const nuevaAgenda = {
          slug: store.nombreAgenda,
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
            throw new Error(`Error en la respuesta: ${response.status}`);
          }

          const data = await response.json();
          console.log("Agenda creada:", data);
        } catch (error) {
          console.error("Error al crear la agenda:", error);
        }
      },

      setNombreAgenda: (nombre) => {
        setStore({ nombreAgenda: nombre });
      },
      obtenerContactos: async () => {
        const store = getStore();
        if (!store.nombreAgenda) {
          alert("No existen contactos");
          // Redirigir a NuevoContacto si es necesario
          return;
        }
        const url = `https://playground.4geeks.com/contact/agendas/${store.nombreAgenda}/contacts`;
        try {
          console.log(`Haciendo fetch a: ${url}`);
          const response = await fetch(url);
          console.log(`Respuesta recibida: ${response.status}`);
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);

          // Aquí actualizamos el estado global con los contactos
          setStore({ contacts: data.contacts });

          return `Agenda cargada correctamente`;
        } catch (e) {
          console.error(`Manejo interno del error: ${e.message}`);
          throw new Error(
            `Manejo interno del error. Error original: ${e.message}`
          );
        }
      },
      goEditContact: async (body, id) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/${id}`,
            {
              method: "PUT",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!responde.ok) {
            throw new Error("No se pudo actualizar");
          }
          const data = await response.json();
          console.log(data);
          const actions = getActions();
          await actions.obtenerContactos();
        } catch {}
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
            throw new Error("No se pudo actualizar");
          }

          const data = await response.json();
          console.log(data);
          await actions.obtenerContactos(); // Para actualizar la lista de contactos
        } catch (error) {
          console.error("Error al editar el contacto:", error);
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
