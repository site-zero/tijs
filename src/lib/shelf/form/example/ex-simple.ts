export default {
  name: "simple",
  text: "i18n:simple",
  comConf: {
    data: {
      id: "Um5Cub2yX",
      name: "Mahanta Lloyd",
      title: "pamperedly schmitz enne",
      brief: "Earthy numerably abulia globus rosinweed. ",
      client: "192.168.12.211",
      age: 32,
      role: "staff",
      address: "stuck-uppishness pteromalid"
    },
    defaultComType: "TiInput",
    layout: "[[3,800],[2,400],1]",
    fields: [
      {
        title: "Id",
        name: "id",
        className: "haha-title",
        style: {
          color: "red",
          gridColumnEnd: "span 1"
        },
        comType: "TiLabel"
      },
      {
        title: "Age",
        name: "age",
        type: "Integer"
      },
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Title",
        name: "title"
      },
      {
        title: "Brief",
        name: "breif"
      },
      {
        title: "Client",
        name: "client"
      },
      {
        title: "Role",
        name: "role"
      }
    ]
  }
};
